<template>
  <el-dialog v-model="isModalVisible" :title="title">
    <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
    <el-text size="large">{{ props.memo }}</el-text>
    <BudgetCategoriesTreeSelect v-model="selectedBudgetCategory"/>
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
  },
  selectedBudgetCategory: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:isVisible', 'categoryUpdated']);

const isModalVisible = ref(props.isVisible);
const selectedBudgetCategory = ref(props.selectedBudgetCategory);

watch(() => props.isVisible, (newValue) => {
  isModalVisible.value = newValue;
  if (newValue) {
    selectedBudgetCategory.value = props.selectedBudgetCategory || '';
  }
});

watch(() => props.selectedBudgetCategory, (newValue) => {
  if (isModalVisible.value) {
    selectedBudgetCategory.value = newValue || '';
  }
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
          ElMessage.error(`An error occurred while assigning the budget category: ${error.message}`);
        }
      });
};

const closeModal = () => {
  emit('update:isVisible', false);
};
</script>

<style scoped>
</style>

