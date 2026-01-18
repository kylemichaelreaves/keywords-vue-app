import { computed, type Ref } from 'vue'
import * as d3 from 'd3'
import type { BudgetCategorySummary } from '@types'

/**
 * Composable that provides consistent color mapping for budget categories
 * matching the BudgetCategoryPieChart color scheme
 */
export function useBudgetCategoryColors(data: Ref<BudgetCategorySummary[] | undefined>) {
  // Generate color scheme that matches BudgetCategoryPieChart exactly
  const colorScheme = computed(() => {
    if (!data.value?.length) return new Map<string, string>()

    // Filter categories with non-zero amounts (like pieData does)
    const categoriesWithData = data.value.filter((cat) => Math.abs(cat.total_amount_debit) > 0)
    // Get parent categories for base color assignment
    const parentCategories = categoriesWithData.filter((cat) => cat.parent_id === null)

    const baseColors = d3.schemeCategory10.concat(d3.schemeSet2)
    const colorMap = new Map<string, string>()

    // First, assign colors to parent categories
    parentCategories.forEach((parent, index) => {
      const baseColor = baseColors[index % baseColors.length]
      // Use explicit casting to bypass TypeScript errors
      if (parent.category_id != null && baseColor) {
        colorMap.set(String(parent.category_id), baseColor)
      }
      if (parent.category_name && baseColor) {
        colorMap.set(parent.category_name, baseColor)
      }
      // Generate shades for children of this parent
      const children = categoriesWithData.filter((cat) => cat.parent_id === parent.category_id)
      children.forEach((child, childIndex) => {
        // Fix D3 color type issue by ensuring baseColor is a string
        const shade = d3.color(baseColor as string)?.darker(0.3 + childIndex * 0.2)
        const childColor = shade ? shade.toString() : baseColor

        if (child.category_id != null && childColor) {
          colorMap.set(String(child.category_id), childColor)
        }
        if (child.category_name && childColor) {
          colorMap.set(child.category_name, childColor)
        }
      })
    })

    // Handle any categories that don't have parents (orphaned categories)
    const orphanedCategories = categoriesWithData.filter((cat) => {
      return cat.category_id != null && !colorMap.has(String(cat.category_id))
    })

    if (orphanedCategories.length > 0) {
      // Assign colors to orphaned categories
      orphanedCategories.forEach((orphan, index) => {
        const colorIndex = parentCategories.length + index
        const orphanColor = baseColors[colorIndex % baseColors.length]

        if (orphan.category_id != null && orphanColor) {
          colorMap.set(String(orphan.category_id), orphanColor)
        }
        if (orphan.category_name && orphanColor) {
          colorMap.set(orphan.category_name, orphanColor)
        }
      })
    }
    return colorMap
  })

  // Get color by category name (for table use)
  const getColorByName = (categoryName?: string): string => {
    if (!categoryName) return 'transparent'
    return colorScheme.value.get(categoryName) || '#999999'
  }

  // Get color by category ID (for pie chart use)
  const getColorById = (categoryId?: number): string => {
    if (!categoryId) return 'transparent'
    return colorScheme.value.get(String(categoryId)) || '#999999'
  }

  return {
    colorScheme,
    getColorByName,
    getColorById,
  }
}
