<template>
  <el-form :model="memo" label-width="120px">
    <el-form-item
        v-for="(field, key) in fields"
        :key="key"
        :label="field.label"
    >
      <component
          :is="field.component"
          v-model="memo[key]"
          :placeholder="field.placeholder"
          :disabled="field.disabledCondition ? !memo[field.disabledCondition] : false"
      >
        <template v-if="field.component === 'el-select'">
          <el-option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
          />
        </template>
      </component>
    </el-form-item>
    <el-button type="primary" @click="saveMemo">Save</el-button>
  </el-form>
</template>

<script setup lang="ts">
import {defineProps, reactive, watch} from 'vue';
import {ElMessage} from 'element-plus';
import type {MemoFormFields, Memo, MemoKeys} from '@types';
import type {PropType} from 'vue';
import mutateMemo from '@api/hooks/transactions/mutateMemo';

const props = defineProps({
  memo: {
    type: Object as PropType<Memo>,
    required: true,
  },
});

const memo = reactive({
  name: props.memo.name,
  recurring: props.memo.recurring,
  necessary: props.memo.necessary,
  frequency: props.memo.frequency,
});

const {mutate} = mutateMemo();

watch(
    () => props.memo,
    (newVal) => {
      memo.name = newVal.name;
      memo.recurring = newVal.recurring;
      memo.necessary = newVal.necessary;
      memo.frequency = newVal.frequency;
    },
    {
      deep: true,
      immediate: true
    }
);

const fields: Record<MemoKeys, MemoFormFields> = {
  name: {
    component: 'el-input',
    label: 'Memo Name',
    placeholder: 'Enter a memo name',
  },
  recurring: {
    component: 'el-switch',
    label: 'Recurring',
  },
  necessary: {
    component: 'el-switch',
    label: 'Necessary',
  },
  frequency: {
    component: 'el-select',
    label: 'Frequency',
    placeholder: 'Select frequency',
    disabledCondition: 'recurring',
    options: [
      {value: 'daily', label: 'Daily'},
      {value: 'weekly', label: 'Weekly'},
      {value: 'monthly', label: 'Monthly'},
      {value: 'yearly', label: 'Yearly'},
    ],
  },
};

const saveMemo = () => {
  mutate(
      {
        memo: props.memo,
      },
      {
        onSuccess: () => {
          ElMessage.success('Memo updated successfully.');
        },
        onError: (error) => {
          ElMessage.error(`An error occurred while updating the memo: ${error.message}`);
        },
      }
  );
};

</script>

<style scoped>
</style>
