<template>
  <div>
    <AlertComponent
      v-if="isError && error"
      :message="error.message"
      type="error"
      :title="error.name"
    />
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="formData"
      label-width="120px"
      :data-testid="props.dataTestId"
    >
      <el-form-item
        v-for="(field, key) in fields"
        :key="key"
        :label="field.label"
        :data-testid="`${props.dataTestId}-${key}-form-item`"
      >
        <component
          :is="field.component"
          v-model="formData[key]"
          :placeholder="field.placeholder"
          :disabled="field.disabledCondition ? field.disabledCondition : false"
          :data-testid="field.dataTestId || `${props.dataTestId}-${key}`"
        >
          <template v-if="field.component === 'el-select'">
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :data-testid="`${props.dataTestId}-${key}-option-${option.value}`"
            />
          </template>
        </component>
      </el-form-item>
      <el-button
        type="primary"
        @click="saveMemo"
        :data-testid="`${props.dataTestId}-save-button`"
        :loading="isPending"
        :disabled="isPending"
      >
        Save
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, reactive, ref, watch } from 'vue'
import { ElMessage, ElOption, type FormInstance, type FormRules } from 'element-plus'
import { useQueryClient } from '@tanstack/vue-query'
import type { Frequency, Memo, MemoFormFields, MemoKeys } from '@types'
import mutateMemo from '@api/hooks/memos/mutateMemo.ts'
import BudgetCategoryTreeSelect from '@components/transactions/selects/BudgetCategoriesTreeSelect.vue'
import MemoAvatar from '@components/memos/MemoAvatar.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'

const props = defineProps({
  memo: {
    type: Object as PropType<Memo>,
    required: true,
  },
  dataTestId: {
    type: String,
    default: 'memo-edit-form',
  },
})

const emit = defineEmits(['close', 'updated'])

const formData = reactive<Memo>({
  id: props.memo.id || 0,
  name: props.memo.name || '',
  recurring: props.memo.recurring || false,
  necessary: props.memo.necessary || false,
  frequency: props.memo.frequency,
  budget_category: props.memo.budget_category || null,
  ambiguous: props.memo.ambiguous || false,
  avatar_s3_url: props.memo.avatar_s3_url,
})

const { mutate, error, isError, isPending } = mutateMemo()
const queryClient = useQueryClient()

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  name: [
    {
      required: true,
      message: 'Memo name is required',
      trigger: 'blur',
    },
  ],
  frequency: [
    {
      validator: (rule, value, callback) => {
        // Only require frequency if recurring is true
        if (formData.recurring && !value) {
          callback(new Error('Frequency is required when recurring is enabled'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

watch(
  () => props.memo,
  (newMemo) => {
    if (newMemo) {
      Object.assign(formData, {
        id: newMemo.id,
        name: newMemo.name || '',
        recurring: newMemo.recurring || false,
        necessary: newMemo.necessary || false,
        frequency: newMemo.frequency,
        budget_category: newMemo.budget_category || null,
        ambiguous: newMemo.ambiguous || false,
        avatar_s3_url: newMemo.avatar_s3_url,
      })
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// Clear the frequency if recurring is set to false / disabled
watch(
  () => formData.recurring,
  (isRecurring) => {
    if (!isRecurring) {
      formData.frequency = undefined
    }
  },
)

const fields: Record<MemoKeys, MemoFormFields> = {
  avatar_s3_url: {
    component: MemoAvatar,
    label: 'Logo',
    placeholder: 'Upload a logo for this vendor',
    dataTestId: `${props.dataTestId}-avatar`,
  },
  name: {
    component: 'el-input',
    label: 'Memo Name',
    placeholder: 'Enter a memo name',
    dataTestId: `${props.dataTestId}-name-input`,
  },
  recurring: {
    component: 'el-switch',
    label: 'Recurring',
    dataTestId: `${props.dataTestId}-recurring-switch`,
  },
  necessary: {
    component: 'el-switch',
    label: 'Necessary',
    dataTestId: `${props.dataTestId}-necessary-switch`,
  },
  frequency: {
    component: 'el-select',
    label: 'Frequency',
    placeholder: 'Select frequency',
    disabledCondition: computed(() => !formData.recurring),
    options: [
      { value: 'daily' as Frequency, label: 'Daily' },
      { value: 'weekly' as Frequency, label: 'Weekly' },
      { value: 'monthly' as Frequency, label: 'Monthly' },
      { value: 'yearly' as Frequency, label: 'Yearly' },
    ],
    dataTestId: `${props.dataTestId}-frequency-select`,
  },
  budget_category: {
    component: BudgetCategoryTreeSelect,
    label: 'Budget Category',
    placeholder: 'Select a budget category',
    dataTestId: `${props.dataTestId}-budget-category-tree-select`,
  },
  ambiguous: {
    component: 'el-switch',
    label: 'Ambiguous',
    dataTestId: `${props.dataTestId}-ambiguous-switch`,
  },
}

const saveMemo = () => {
  // if not valid,  return
  if (!formRef.value) return

  try {
    formRef.value.validate()

    mutate(
      {
        memo: formData,
      },
      {
        onSuccess: () => {
          ElMessage.success('Memo updated successfully.')

          const queries = [
            'budget-category-summary',
            'budget-category-amount-debit',
            'month-summary',
            'week-summary',
            'memo',
          ]

          for (const query of queries) {
            if (query === 'memo') {
              queryClient.invalidateQueries({ queryKey: [query, formData.name] })
            } else {
              queryClient.invalidateQueries({ queryKey: [query] })
            }
          }

          emit('updated', formData)
          emit('close')
        },
        onError: (error) => {
          ElMessage.error(`An error occurred while updating the memo: ${error.message}`)
        },
      },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    ElMessage.error(`An unexpected error occurred: ${errorMessage}`)
  }
}
</script>
