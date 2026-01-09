import { faker } from '@faker-js/faker';
import type { BudgetCategoryHierarchySummaryResponse } from '@types'


// Predefined category hierarchy for realistic data
const categoryHierarchy = {
  'Income': ['Salary', 'Freelance', 'Investments', 'Other Income'],
  'Food & Dining': ['Groceries', 'Restaurants', 'Fast Food', 'Coffee Shops'],
  'Transportation': ['Gas', 'Public Transit', 'Car Maintenance', 'Parking'],
  'Shopping': ['Clothing', 'Electronics', 'Home & Garden', 'Personal Care'],
  'Entertainment': ['Movies', 'Sports', 'Hobbies', 'Subscriptions'],
  'Bills & Utilities': ['Electricity', 'Internet', 'Phone', 'Water'],
  'Health & Fitness': ['Medical', 'Pharmacy', 'Gym', 'Sports Equipment'],
  'Travel': ['Flights', 'Hotels', 'Car Rental', 'Activities'],
  'Education': ['Tuition', 'Books', 'Online Courses', 'Supplies'],
  'Business': ['Office Supplies', 'Software', 'Marketing', 'Equipment']
} as const;

// Type for category hierarchy keys
type CategoryHierarchyKey = keyof typeof categoryHierarchy;

// Generate a single parent category
function generateParentCategory(categoryId: number, categoryName: string, sourceId: number): BudgetCategoryHierarchySummaryResponse {
  return {
    category_id: categoryId,
    category_name: categoryName,
    full_path: categoryName,
    level: 0,
    parent_id: null,
    source_id: sourceId,
    total_amount_debit: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 })
  };
}

// Generate a child category
function generateChildCategory(
  categoryId: number,
  childName: string,
  parentCategory: BudgetCategoryHierarchySummaryResponse
): BudgetCategoryHierarchySummaryResponse {
  return {
    category_id: categoryId,
    category_name: childName,
    full_path: `${parentCategory.full_path} > ${childName}`,
    level: parentCategory.level + 1,
    parent_id: parentCategory.category_id,
    source_id: parentCategory.source_id,
    total_amount_debit: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })
  };
}

// Generate a flat list of budget categories with hierarchy
export function generateBudgetCategoryHierarchy(options: {
  includeChildren?: boolean;
  maxParentCategories?: number;
  sourceId?: number;
} = {}): BudgetCategoryHierarchySummaryResponse[] {
  const {
    includeChildren = true,
    maxParentCategories = Object.keys(categoryHierarchy).length,
    sourceId = faker.number.int({ min: 1, max: 10 })
  } = options;

  const categories: BudgetCategoryHierarchySummaryResponse[] = [];
  let currentId = 1;

  // Get random parent categories
  const parentNames = faker.helpers.shuffle(Object.keys(categoryHierarchy) as CategoryHierarchyKey[])
    .slice(0, maxParentCategories);

  for (const parentName of parentNames) {
    // Create parent category
    const parentCategory = generateParentCategory(currentId++, parentName, sourceId);
    categories.push(parentCategory);

    // Create child categories if requested
    if (includeChildren) {
      const childNames = categoryHierarchy[parentName as CategoryHierarchyKey];
      const numChildren = faker.number.int({ min: 1, max: childNames.length });
      const selectedChildren = faker.helpers.shuffle(childNames).slice(0, numChildren);

      for (const childName of selectedChildren) {
        const childCategory = generateChildCategory(currentId++, childName, parentCategory);
        categories.push(childCategory);
      }
    }
  }

  return categories;
}

// Generate a single random category (can be parent or child)
function generateSingleBudgetCategory(options: {
  level?: number;
  sourceId?: number;
  categoryId?: number;
} = {}): BudgetCategoryHierarchySummaryResponse {
  const {
    level = faker.helpers.arrayElement([0, 1]),
    sourceId = faker.number.int({ min: 1, max: 10 }),
    categoryId = faker.number.int({ min: 1, max: 10000 })
  } = options;

  if (level === 0) {
    // Generate parent category
    const parentName = faker.helpers.arrayElement(Object.keys(categoryHierarchy) as CategoryHierarchyKey[]);
    return generateParentCategory(categoryId, parentName, sourceId);
  } else {
    // Generate child category
    const parentName = faker.helpers.arrayElement(Object.keys(categoryHierarchy) as CategoryHierarchyKey[]);
    const childName = faker.helpers.arrayElement(categoryHierarchy[parentName]);
    const parentId = faker.number.int({ min: 1, max: 1000 });

    return {
      category_id: categoryId,
      category_name: childName,
      full_path: `${parentName} > ${childName}`,
      level: level,
      parent_id: parentId,
      source_id: sourceId,
      total_amount_debit: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })
    };
  }
}

// Generate an array of random budget categories
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateBudgetCategories(count: number): BudgetCategoryHierarchySummaryResponse[] {
  return Array.from({ length: count }, (_, index) =>
    generateSingleBudgetCategory({ categoryId: index + 1 })
  );
}