<template>
  <div v-if="isError">
    <el-alert type="error" :title="error?.message"/>
  </div>
  <el-col class="category-wrapper">
    <el-text tag="u" size="large">Budget Category:</el-text>
    <el-tag v-if="budgetCategory" class="category-tag" size="large" effect="dark" round>
      {{ budgetCategory }}
    </el-tag>
    <el-tag
        v-else-if="!budgetCategory && !isFetching && !isLoading"
        class="category-tag"
        size="large"
        round
        type="danger"
        effect="dark"
    >
      No Budget Category Assigned
    </el-tag>
  </el-col>
</template>

<script setup lang="ts">

import useMemoBudgetCategory from "@api/hooks/transactions/useMemoBudgetCategory";
import type {BudgetCategory, Memo} from "@types";
import {computed, type PropType} from "vue";

const props = defineProps({
  memo: {
    type: String as unknown as PropType<Memo>,
    required: true,
  },
});

// TODO useBudgetCategory hook
const {data, isLoading, isError, isFetching, error} = useMemoBudgetCategory(props.memo);

const budgetCategory = computed(() => {
  // Assert a type: data.value is an array of BudgetCategory objects
  const budgetData = data?.value as BudgetCategory[] | undefined;
  return budgetData ? budgetData[0]?.budget_category : null;
});

</script>


<style scoped>
.category-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.category-tag {
  margin-left: 20px; /* Add space to the left of the tag */
}
</style>
