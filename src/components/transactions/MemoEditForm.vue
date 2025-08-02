<template>
  <el-form :model="formData" label-width="120px" :data-testid="dataTestId">
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
    >
      Save
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { defineProps, reactive, watch } from 'vue'
import { ElMessage, ElOption } from 'element-plus'
import type { Memo, MemoFormFields, MemoKeys, Frequency } from '@types'
import mutateMemo from '@api/hooks/transactions/mutateMemo'
import BudgetCategoryTreeSelect from '@components/transactions/BudgetCategoriesTreeSelect.vue'
import MemoAvatar from '@components/transactions/MemoAvatar.vue'

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

const formData = reactive<{
  name: string
  recurring: boolean
  necessary: boolean
  frequency: Frequency | null
  budget_category: string | null
  ambiguous: boolean
  avatar_s3_url: string | null
}>({
  name: '',
  recurring: false,
  necessary: false,
  frequency: null,
  budget_category: null,
  ambiguous: false,
  avatar_s3_url: null
})

const { mutate } = mutateMemo()

// Watch for changes to the memo prop and update the reactive form data
watch(
  () => props.memo,
  (newMemo) => {
    console.log('MemoEditForm received memo prop:', newMemo) // Debug log
    if (newMemo) {
      formData.name = newMemo.name || ''
      formData.recurring = newMemo.recurring || false
      formData.necessary = newMemo.necessary || false
      formData.frequency = newMemo.frequency || null
      formData.budget_category = newMemo.budget_category || null
      formData.ambiguous = newMemo.ambiguous || false
      formData.avatar_s3_url = newMemo.avatar_s3_url || null

      console.log('Updated formData:', formData) // Debug log
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// Extended fields configuration with optional custom test IDs
const fields: Record<MemoKeys, MemoFormFields & { dataTestId?: string }> = {
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
    disabledCondition: formData.recurring,
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
      memo: props.memo
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
