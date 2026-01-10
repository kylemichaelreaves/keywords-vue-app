<template>
  <el-autocomplete
    v-model="selectedValue"
    :fetch-suggestions="handleFetchSuggestions"
    :placeholder="props.placeholder"
    @select="(item: Record<string, unknown>) => handleSelect(item)"
    @change="(value: string | number) => handleChange(value)"
    @clear="handleClear"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
    clearable
    :loading="props.loading"
    :loading-text="props.loadingText"
    :data-testid="props.dataTestId"
    value-key="label"
    :trigger-on-focus="true"
    :debounce="300"
    :highlight-first-item="true"
    style="width: 100%"
  >
    <template #default="{ item }">
      <div class="autocomplete-item">
        <span class="label">{{ (item as Option).label }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { ElAutocomplete } from 'element-plus'
import type { PropType } from 'vue'

interface Option {
  value: string
  label: string
}

// Replace the selectedValue prop and onChange with defineModel
const selectedValue = defineModel<string>({
  default: '',
})

const props = defineProps({
  options: {
    type: Array as PropType<Array<Option>>,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onClear: {
    type: Function as PropType<() => void>,
    required: false,
  },
  onSearch: {
    type: Function as PropType<(query: string, callback: (results: Option[]) => void) => void>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  dataTestId: {
    type: String,
    default: '',
  },
  minCharacters: {
    type: Number,
    default: 0,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
})

const handleFetchSuggestions = (
  queryString: string,
  callback: (suggestions: Option[]) => void,
): void => {
  // If onSearch prop is provided, use server-side search
  if (props.onSearch) {
    props.onSearch(queryString, callback)
    return
  }

  // Otherwise, fall back to client-side filtering
  if (!queryString || queryString.length === 0) {
    const limitedResults = props.options?.slice(0, 50)
    callback(limitedResults || [])
    return
  }

  if (queryString.length < props.minCharacters) {
    const limitedResults = props.options?.slice(0, 50)
    callback(limitedResults || [])
    return
  }

  const results = props.options?.filter((option) =>
    option.label.toLowerCase().includes(queryString.toLowerCase()),
  )

  const limitedResults = results.slice(0, 50)
  callback(limitedResults)
}

const handleSelect = (item: Record<string, unknown>): void => {
  if (item && typeof item.value === 'string' && typeof item.label === 'string') {
    selectedValue.value = item.value // Direct assignment!
  }
}

const handleChange = (value: string | number): void => {
  const stringValue = String(value)
  const existingOption = props.options?.find((option) => option.label === stringValue)
  if (existingOption) {
    selectedValue.value = existingOption.value // Direct assignment!
  } else {
    selectedValue.value = stringValue // Direct assignment!
  }
}

const handleClear = (): void => {
  if (props.onClear) {
    props.onClear()
  }
}
</script>
