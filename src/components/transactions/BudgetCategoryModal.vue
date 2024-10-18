<template>
  <el-dialog v-model="isModalVisible" :title="title">
    <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
    <el-text size="large">{{ props.memo }}</el-text>
    <BudgetCategoriesTreeSelect v-model:selected-budget-category="selectedBudgetCategory"/>
    <template #footer>
      <el-button @click="closeModal">Cancel</el-button>
      <el-button type="primary" @click="saveCategory">Save</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ElDialog, ElButton, ElMessage} from "element-plus";
import {ref, watch} from 'vue';
import BudgetCategoriesTreeSelect from "@components/transactions/BudgetCategoriesTreeSelect.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import mutateMemoBudgetCategory from "@api/hooks/transactions/mutateMemoBudgetCategory";

const props = defineProps({
  title: {
    type: String,
    default: "Assign Budget Category"
  },
  memo: {
    type: String,
    required: true
  },
  isVisible: {
    type: Boolean,
    required: true
  }
});


const emit = defineEmits(['update:isVisible', 'categoryUpdated']);


const isModalVisible = ref(props.isVisible);
const selectedBudgetCategory = ref('');

watch(() => props.isVisible, (newValue) => {
  isModalVisible.value = newValue;
});


const {error, mutate, isError} = mutateMemoBudgetCategory();

const saveCategory = () => {
  if (!selectedBudgetCategory.value) {
    ElMessage.warning('Please select a budget category before saving.');
    return;
  }


  mutate({
        memo: props.memo,
        budgetCategory: selectedBudgetCategory.value
      },
      {
        onSuccess: () => {
          ElMessage.success('Budget category assigned successfully.');
          emit('categoryUpdated', selectedBudgetCategory.value);
          closeModal();
        },
        onError: (error) => {
          ElMessage.error('An error occurred while assigning the budget category.');
        }
      });

  emit('categoryUpdated', selectedBudgetCategory.value);

  closeModal();
};

const closeModal = () => {
  emit('update:isVisible', false);
};
</script>

<style scoped>
</style>
