<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <el-col class="category-wrapper">
    <el-text tag="u" size="large">Budget Category:</el-text>
    <el-tag v-if="budgetCategory" class="category-tag" size="large" effect="dark" round>
      {{ budgetCategory }}
    </el-tag>
    <el-button
        v-else-if="buttonCondition"
        class="category-tag"
        size="large"
        round
        type="danger"
        effect="dark"
        @click="openModal"
    >
      No Budget Category Assigned
    </el-button>
  </el-col>
  <BudgetCategoryModal
      :memo="props.memoName"
      :isVisible="isModalVisible"
      @update:isVisible="closeModal"
      @category-updated="refetch"
      @update:selected-budget-category="handleCategoryUpdated"
  />
</template>

<script setup lang="ts">
import useMemoBudgetCategory from "@api/hooks/transactions/useMemoBudgetCategory";
import type {BudgetCategory, Memo} from "@types";
import {computed, type PropType, ref, watch} from "vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import BudgetCategoryModal from "@components/transactions/BudgetCategoryModal.vue";

const props = defineProps({
  memoName: {
    type: String as PropType<Memo['name']>,
    required: true,
  },
});

const buttonCondition = computed(() => {
  return !budgetCategory.value && !isFetching.value && !isLoading.value && !isRefetching.value;
});

const {data, isLoading, isError, refetch, isRefetching, isFetching, error} = useMemoBudgetCategory(props.memoName);

const isModalVisible = ref(false);

const selectedBudgetCategory = ref('');

const openModal = () => {
  isModalVisible.value = true;

};

const closeModal = () => {
  isModalVisible.value = false;
};

const handleCategoryUpdated = (category: string) => {
  selectedBudgetCategory.value = category;
};

const budgetCategory = computed(() => {
  const budgetData = data?.value as BudgetCategory[] | undefined;
  return budgetData ? budgetData[0]?.budget_category : null;
});


watch(() => props.memoName, () => {
  refetch();
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
  margin-left: 20px;
}
</style>
