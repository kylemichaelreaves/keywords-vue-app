<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <div class="flex-container">
    <el-text type="primary" class="text">
      Budget Category
    </el-text>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-tree-select
            :data="selectTreeData"
            v-model="selectedBudgetCategory"
            class="tree-select"
            show-checkbox
        />
      </el-col>
      <el-col :span="8">
        <div v-if="selectedBudgetCategory" class="button-container">
          <el-button
              type="danger"
              @click="resetSelectedBudgetCategory"
          >
          Reset Category
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, defineEmits} from "vue";
import {ElText, ElTreeSelect} from "element-plus";
import {useBudgetCategories} from "@api/hooks/transactions/useBudgetCategories";
import {convertToTree} from "@api/helpers/convertToTree";
import {useTransactionsStore} from "@stores/transactions";
import type {CategoryTreeNode} from "@types";
import AlertComponent from "@components/shared/AlertComponent.vue";

const props = defineProps({
  selectedBudgetCategory: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:selected-budget-category']);

const store = useTransactionsStore();

// Use ref to bind the selected budget category
const selectedBudgetCategory = ref(props.selectedBudgetCategory);

const {data, isError, error} = useBudgetCategories();

// Convert the data to a format that the tree select component can use
const selectTreeData = computed(() => {
  if (!data.value || !data.value.length) {
    return [];
  } else {
    return data.value.map((item) => convertToTree(item.data)).flat();
  }
});

// Function to find the label from the value in the category tree
const getLabelFromValue = (value: string): string | null => {
  const findItemInTree = (items: CategoryTreeNode[], value: string): CategoryTreeNode | null => {
    for (const item of items) {
      if (item.value === value) {
        return item;
      }
      if (item.children) {
        const foundChild = findItemInTree(item.children, value);
        if (foundChild) {
          return foundChild;
        }
      }
    }
    return null;
  };

  const foundItem = findItemInTree(selectTreeData.value, value);
  return foundItem ? foundItem.label : `${value} not found`;
};

// Reset the selected category to null
const resetSelectedBudgetCategory = () => {
  selectedBudgetCategory.value = null;
  store.setSelectedBudgetCategory(null);
  emit('update:selected-budget-category', null);
};

// Watch for changes in the selected budget category
watch(selectedBudgetCategory, (newVal) => {
  if (newVal) {
    const budgetCategoryLabel = getLabelFromValue(newVal);
    store.setSelectedBudgetCategory(budgetCategoryLabel);
    emit('update:selected-budget-category', budgetCategoryLabel);
  }
});

</script>

<style scoped>
.text {
  align-self: start;
}

.flex-container {
  display: flex;
  align-items: start;
  flex-direction: column;
}

.button-container {
  margin-left: auto;
}

.tree-select {
  width: 20vw;
}
</style>
