<template>
  <div>
    <AlertComponent v-if="isError && error" :message="error.message" type="error" :title="error.name"/>
    <el-form :model="formData" label-width="120px" :data-testid="props.dataTestId">
      <el-form-item
        v-for="(field, key) in fields"
        :key="key"
        :label="field.label"
        :data-testid="`${dataTestId}-${key}-form-item`"
      >
        <component
          :is="field.component"
          v-model="formData[key]"
          :placeholder="field.placeholder"
          :disabled="field.disabledCondition ? field.disabledCondition : false"
          :data-testid="field.dataTestId || `${dataTestId}-${key}`"
        >
          <template v-if="field.component === 'el-select'">
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :data-testid="`${dataTestId}-${key}-option-${option.value}`"
            />
          </template>
        </component>
      </el-form-item>
      <el-button
        type="primary"
        @click="saveMemo"
        :data-testid="`${dataTestId}-save-button`"
        :loading="isPending"
        :disabled="isPending"
      >
        Save
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { defineProps, reactive, watch, computed } from 'vue'
import { ElMessage, ElOption } from 'element-plus'
import type { Memo, MemoFormFields, MemoKeys } from '@types'
import mutateMemo from '@api/hooks/transactions/mutateMemo'
import BudgetCategoryTreeSelect from '@components/transactions/BudgetCategoriesTreeSelect.vue'
import MemoAvatar from '@components/transactions/MemoAvatar.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'

const props = defineProps({
  memo: {
    type: Object as PropType<Memo>,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'memo-edit-form'
  }
})

const formData = reactive<Memo>({
  id: props.memo.id || 0,
  name: props.memo.name || '',
  recurring: props.memo.recurring || false,
  necessary: props.memo.necessary || false,
  frequency: props.memo.frequency || null,
  budget_category: props.memo.budget_category || null,
  ambiguous: props.memo.ambiguous || false,
  avatar_s3_url: props.memo.avatar_s3_url || null
})

const { mutate, error, isError, isPending } = mutateMemo()

// Watch for changes to the memo prop and update the reactive form data
watch(
  () => props.memo,
  (newMemo) => {
    if (newMemo) {
      Object.assign(formData, newMemo)
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// Extended fields configuration with optional custom test IDs
const fields: Record<MemoKeys, MemoFormFields> = {
  avatar_s3_url: {
    component: MemoAvatar,
    label: 'Logo',
    placeholder: 'Upload a logo for this vendor',
    dataTestId: `${props.dataTestId}-avatar`
  },
  name: {
    component: 'el-input',
    label: 'Memo Name',
    placeholder: 'Enter a memo name',
    dataTestId: `${props.dataTestId}-name-input`
  },
  recurring: {
    component: 'el-switch',
    label: 'Recurring',
    dataTestId: `${props.dataTestId}-recurring-switch`
  },
  necessary: {
    component: 'el-switch',
    label: 'Necessary',
    dataTestId: `${props.dataTestId}-necessary-switch`
  },
  frequency: {
    component: 'el-select',
    label: 'Frequency',
    placeholder: 'Select frequency',
    disabledCondition: computed(() => !formData.recurring),
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' }
    ],
    dataTestId: `${props.dataTestId}-frequency-select`
  },
  budget_category: {
    component: BudgetCategoryTreeSelect,
    label: 'Budget Category',
    placeholder: 'Select a budget category',
    dataTestId: `${props.dataTestId}-budget-category-tree-select`
  },
  ambiguous: {
    component: 'el-switch',
    label: 'Ambiguous',
    dataTestId: `${props.dataTestId}-ambiguous-switch`
  }
}

const saveMemo = () => {
  mutate(
    {
      memo: formData
    },
    {
      onSuccess: () => {
        ElMessage.success('Memo updated successfully.')
      },
      onError: (error) => {
        ElMessage.error(`An error occurred while updating the memo: ${error.message}`)
      }
    }
  )
}
</script>
