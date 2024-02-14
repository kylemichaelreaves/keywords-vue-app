<template>
  <div class="flex-container">
    <el-text type="primary" class="text">
      Budget Category
    </el-text>
    <el-row>
      <el-col :span="12">
        <el-tree-select
            :data="selectTreeData"
            v-model="selectedBudgetCategory"
            class="tree-select"
            show-checkbox
        />
      </el-col>
      <el-col :span="12">
        <div v-if="selectedBudgetCategory" class="button-container">
          <el-button
              type="danger"
              @click="updateSelectedBudgetCategory('')"
          >
            Reset Category
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref, watch} from "vue";
import {ElText, ElTreeSelect} from "element-plus";
import {useBudgetCategories} from "@api/hooks/transactions/useBudgetCategories";
import {convertToTree} from "@api/helpers/convertToTree";
import {useTransactionsStore} from "@stores/transactions";
import type {CategoryTreeData} from "@types";

export default defineComponent({
  name: "BudgetCategoriesTreeSelect",
  components: {
    ElTreeSelect,
    ElText
  },
  setup() {

    const store = useTransactionsStore();
    const selectedBudgetCategory = ref('');

    const {data, isFetching, isLoading, isError, error} = useBudgetCategories()

    // convert the data to a format that the tree select component can use
    // use the convertToTree function
    const selectTreeData = computed(() => {
      if (!data.value || !data.value.length) {
        return []
      } else {
        // Iterate over the data.value array
        return data.value.map((item) => {
          // Get the 'data' object and convert it to a tree
          return convertToTree(item.data);
        }).flat();
      }
    });

    const getLabelFromValue = (value: string) => {
      const foundItem = selectTreeData.value.find(item => item.value === value);
      console.log('foundItem', foundItem)
      if (!foundItem) {
        return '';
      }
      return foundItem.label
    }

    function findLabel(data: CategoryTreeData, value: string): string | null {
      for (let item of data) {
        if (item.value === value) {
          return item.label;
        } else if (item.children) {
          let label = findLabel(item.children, value);
          if (label) {
            return label;
          }
        }
      }
      return null;
    }


    const updateSelectedBudgetCategory = (category: string) => {
      const budgetCategoryLabel = getLabelFromValue(category);
      console.log('budgetCategoryLabel', budgetCategoryLabel)
      store.setSelectedBudgetCategory(budgetCategoryLabel);
      selectedBudgetCategory.value = budgetCategoryLabel;
    }


    watch(() => selectedBudgetCategory.value, (newVal, oldVal) => {
      store.setSelectedBudgetCategory(newVal)
    })

    return {
      data,
      isFetching,
      isLoading,
      isError,
      error,
      selectedBudgetCategory,
      selectTreeData,
      store,
      updateSelectedBudgetCategory
    };
  }
})
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
  width: 10vw;
}
</style>

