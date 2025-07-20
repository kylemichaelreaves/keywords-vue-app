<template>
  <el-form :model="memo" label-width="120px" :data-testid="dataTestId">
    <el-form-item
      v-for="(field, key) in fields"
      :key="key"
      :label="field.label"
      :data-testid="`${dataTestId}-${key}-form-item`"
    >
      <component
        :is="field.component"
        v-model="memo[key]"
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
import type { Memo, MemoFormFields, MemoKeys } from '@types'
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

const memo = reactive({
  name: props.memo.name,
  recurring: props.memo.recurring,
  necessary: props.memo.necessary,
  frequency: props.memo.frequency,
  budget_category: props.memo.budget_category,
  ambiguous: props.memo.ambiguous,
  avatar_s3_url: props.memo.avatar_s3_url
})

const { mutate } = mutateMemo()

watch(
  () => props.memo,
  (newVal) => {
    memo.name = newVal.name
    memo.recurring = newVal.recurring
    memo.necessary = newVal.necessary
    memo.frequency = newVal.frequency
    memo.budget_category = newVal.budget_category
    memo.ambiguous = newVal.ambiguous
    memo.avatar_s3_url = newVal.avatar_s3_url
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
    label: 'Recurring'
  },
  necessary: {
    component: 'el-switch',
    label: 'Necessary'
  },
  frequency: {
    component: 'el-select',
    label: 'Frequency',
    placeholder: 'Select frequency',
    disabledCondition: memo.recurring,
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' }
    ]
  },
  budget_category: {
    component: BudgetCategoryTreeSelect,
    label: 'Budget Category',
    placeholder: 'Select a budget category'
  },
  ambiguous: {
    component: 'el-switch',
    label: 'Ambiguous'
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

<style scoped>
</style>