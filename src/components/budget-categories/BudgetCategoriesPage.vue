<template>
  <div class="bv-categories">
    <div class="bv-intro">
      <h2 class="bv-intro-title">Budget categories</h2>
      <p class="bv-intro-desc">
        Hierarchy from the API (read-only). Use this path string when assigning categories on
        transactions and memos.
      </p>
    </div>

    <AlertComponent
      v-if="isError && error"
      type="error"
      :title="error.name"
      :message="error.message"
      data-testid="budget-categories-error"
    />

    <div class="bv-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Search categories..."
        clearable
        :prefix-icon="Search"
        class="bv-search"
        data-testid="budget-categories-search"
      />
      <el-button :icon="Refresh" :loading="isPending" @click="refetch()">Refresh</el-button>
      <el-button @click="expandAll">Expand All</el-button>
      <el-button @click="collapseAll">Collapse All</el-button>
    </div>

    <div v-if="isPending" class="bv-tree-skeleton">
      <el-skeleton v-for="i in 8" :key="i" animated>
        <template #template>
          <el-skeleton-item
            variant="text"
            :style="{ width: `${40 + ((i * 17) % 50)}%`, marginLeft: `${((i - 1) % 4) * 14}px` }"
          />
        </template>
      </el-skeleton>
    </div>

    <el-empty
      v-else-if="!filteredRows.length && !searchQuery"
      description="No budget categories found."
      data-testid="budget-categories-empty"
    />

    <el-empty
      v-else-if="!filteredRows.length && searchQuery"
      description="No categories match your search."
      data-testid="budget-categories-no-results"
    />

    <div v-else class="bv-tree" data-testid="budget-categories-tree">
      <div
        v-for="row in filteredRows"
        :key="row.path"
        class="bv-tree-row"
        :style="{ paddingLeft: `${Math.min(row.depth, 12) * 14 + 8}px` }"
        :data-testid="`budget-category-row-${encodeURIComponent(row.path)}`"
      >
        <button
          v-if="row.hasChildren"
          type="button"
          class="bv-tree-toggle"
          :aria-expanded="expandedPaths.has(row.path)"
          :aria-label="`${expandedPaths.has(row.path) ? 'Collapse' : 'Expand'} category ${row.node.label}`"
          @click="toggleExpand(row.path)"
        >
          <el-icon :class="{ 'is-expanded': expandedPaths.has(row.path) }">
            <ArrowRight />
          </el-icon>
        </button>
        <span v-else class="bv-tree-leaf-spacer" />
        <span class="bv-tree-label">{{ row.node.label }}</span>
        <span class="bv-tree-path">{{ row.path }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Refresh, ArrowRight } from '@element-plus/icons-vue'
import { useBudgetCategories } from '@api/hooks/budgetCategories/useBudgetCategories.ts'
import { convertToTree } from '@api/helpers/convertToTree.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'
import type { CategoryNode } from '@types'

interface FlatRow {
  node: CategoryNode
  depth: number
  path: string
  hasChildren: boolean
}

const searchQuery = ref('')
const expandedPaths = ref(new Set<string>())

const { data, isPending, isError, error, refetch } = useBudgetCategories()

const treeData = computed<CategoryNode[]>(() => {
  const raw = data.value?.[0]?.data
  if (!raw) return []
  return convertToTree(raw)
})

function flattenTree(
  nodes: CategoryNode[],
  depth: number,
  expanded: Set<string> | null,
): FlatRow[] {
  const rows: FlatRow[] = []
  for (const node of nodes) {
    const hasChildren = Boolean(node.children?.length)
    rows.push({ node, depth, path: node.value, hasChildren })
    if (hasChildren && (expanded === null || expanded.has(node.value))) {
      rows.push(...flattenTree(node.children!, depth + 1, expanded))
    }
  }
  return rows
}

function collectAllPaths(nodes: CategoryNode[]): string[] {
  const paths: string[] = []
  for (const node of nodes) {
    if (node.children?.length) {
      paths.push(node.value, ...collectAllPaths(node.children))
    }
  }
  return paths
}

const filteredRows = computed<FlatRow[]>(() => {
  const tree = treeData.value
  if (!tree.length) return []

  const query = searchQuery.value.toLowerCase().trim()

  if (!query) {
    return flattenTree(tree, 0, expandedPaths.value)
  }

  // When searching: flatten entire tree, then keep rows that match or have matching descendants
  const allRows = flattenTree(tree, 0, null)
  const matchingPaths = new Set(
    allRows.filter((r) => r.path.toLowerCase().includes(query)).map((r) => r.path),
  )

  // A row is visible if it matches, or if any matching path starts with this row's path
  return allRows.filter((row) => {
    if (matchingPaths.has(row.path)) return true
    const prefix = row.path + ' - '
    for (const mp of matchingPaths) {
      if (mp.startsWith(prefix)) return true
    }
    return false
  })
})

function toggleExpand(path: string) {
  const next = new Set(expandedPaths.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  expandedPaths.value = next
}

function expandAll() {
  expandedPaths.value = new Set(collectAllPaths(treeData.value))
}

function collapseAll() {
  expandedPaths.value = new Set()
}
</script>

<style scoped>
.bv-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bv-intro {
  margin-bottom: 0;
}

.bv-intro-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--app-text-color);
}

.bv-intro-desc {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--bv-sidebar-muted);
  line-height: 1.5;
}

.bv-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bv-search {
  flex: 1;
}

.bv-search :deep(.el-input__wrapper) {
  --el-input-border-color: var(--bv-border);
  --el-input-focus-border-color: var(--bv-primary);
}

.bv-tree-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bv-tree {
  border: 1px solid var(--bv-border);
  border-radius: 6px;
  overflow: hidden;
}

.bv-tree-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 8px;
  border-bottom: 1px solid var(--bv-border);
  font-size: 0.875rem;
  transition: background-color 0.15s;
}

.bv-tree-row:last-child {
  border-bottom: none;
}

.bv-tree-row:hover {
  background-color: var(--bv-sidebar-hover-bg);
}

.bv-tree-toggle {
  display: inline-flex;
  cursor: pointer;
  width: 16px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
}

.bv-tree-toggle .el-icon {
  transition: transform 0.2s;
  font-size: 12px;
  color: var(--bv-sidebar-muted);
}

.bv-tree-toggle .el-icon.is-expanded {
  transform: rotate(90deg);
}

.bv-tree-leaf-spacer {
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
}

.bv-tree-label {
  color: var(--app-text-color);
  font-weight: 500;
  white-space: nowrap;
}

.bv-tree-path {
  color: var(--bv-sidebar-muted);
  font-size: 0.75rem;
  margin-left: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
