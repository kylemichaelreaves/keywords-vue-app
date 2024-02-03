/**
 * CategoryNode interface represents a node in the category tree.
 * Each node has a value, a label, and optionally an array of child nodes.
 */
interface CategoryNode {
    value: string; // The value of the node
    label: string; // The label of the node
    children?: CategoryNode[]; // The child nodes of the node
}

/**
 * convertToTree: converts the data object resulting from the useBudgetCategories hook into a tree of CategoryNodes.
 * by iterating over the keys of the categories object and creating a new CategoryNode for each.
 * If a category has subcategories, it recursively calls itself to create a tree for each subcategory.
 *
 * Note: The result of this function is an array of arrays. It's necessary, therefore, to call .flat() on the result
 * so that it can be consumed by the el-select-tree, which expects a flat array of options (CategoryNodes).
 *
 * @param {Record<string, any>} categories - The categories object to convert into a tree.
 * @param {string} parentValue - The value of the parent node. Used to create the value of the current node.
 * @returns {CategoryNode[]} - An array of CategoryNodes representing the tree.
 */
export function convertToTree(categories: Record<string, any>, parentValue: string = ''): CategoryNode[] {
    return Object.keys(categories).map((key, index) => {
        // Create the value for the current node
        const value = parentValue ? `${parentValue}-${index + 1}` : `${index + 1}`;

        // If the current category has subcategories, create a tree for them
        const children = Object.keys(categories[key]).length > 0
            ? convertToTree(categories[key], value)
            : undefined;

        // Return a new CategoryNode
        return {
            value,
            label: key,
            ...(children && {children}),
        };
    });
}