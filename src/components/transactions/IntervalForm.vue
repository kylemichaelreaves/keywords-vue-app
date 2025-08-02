<template>
  <AlertComponent
    title="Interval Exceeds Oldest Transaction"
    message="Your requested interval exceeds the oldest dated transaction. Please choose a smaller interval."
    type="error"
    v-if="isOutOfRange"
    @close="onClose"
  />

  <AlertComponent
    :title="error.name"
    :message="error.message"
    type="error"
    v-if="error && isError"
  />

  <el-form label-position="top" :disabled="isOutOfRange || isFetching || isLoading" data-testid="interval-form">
    <div class="form-row">
      <el-form-item label="Interval Count" class="form-item-inline">
        <el-input-number
          v-model="numberInput"
          :min="1"
          :max="100"
          :step="1"
          @change="handleNumberInputChange"
          controls-position="right"
          class="input-number-inline"
          data-testid="interval-input-number"
        />
      </el-form-item>
      <el-form-item label="Interval Type" class="form-item-inline">
        <el-select
          v-model="intervalSelect"
          placeholder="Select interval"
          class="select-inline"
          clearable
          @clear="onClearIntervalSelect"
          data-testid="interval-select"
        >
          <el-option
            v-for="option in selectOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useIsIntervalGreaterThanOldestDate } from "@api/hooks/transactions/useIsIntervalGreaterThanOldestDate";
import AlertComponent from "@components/shared/AlertComponent.vue";

// Using defineModel for the interval value
const intervalValue = defineModel<string>('intervalValue', {
  default: '1 month'
});


const intervalSelect = ref("month");
const numberInput = ref(1);

// Computed property to build the interval string
const computedIntervalValue = computed(() => {
  return `${numberInput.value} ${intervalSelect.value}`;
});

const { data, error, isError, isLoading, isFetching, refetch } = useIsIntervalGreaterThanOldestDate(computedIntervalValue);

// get is_out_of_range from the data object
const isOutOfRange = computed(() => {
  return data?.value?.map((item: { is_out_of_range: boolean }) => item.is_out_of_range)[0];
});

const handleNumberInputChange = (value: number) => {
  numberInput.value = value;
}

const onClose = () => {
  intervalSelect.value = "month";
  numberInput.value = 1;
}

const onClearIntervalSelect = () => {
  intervalSelect.value = "";
}

const selectOptions = computed(() => {
  return [
    { value: "days", label: numberInput.value == 1 ? "Day" : "Days" },
    { value: "weeks", label: numberInput.value == 1 ? "Week" : "Weeks" },
    { value: "months", label: numberInput.value == 1 ? "Month" : "Months" },
    { value: "years", label: numberInput.value == 1 ? "Year" : "Years" },
  ];
});

// Update the model value whenever the computed interval changes
watch(computedIntervalValue, (newVal) => {
  if (newVal) {
    intervalValue.value = newVal;
  }
});

watch(intervalSelect, (newVal) => {
  if (newVal) {
    refetch();
  }
});
</script>

<style scoped>
.form-row {
  display: flex;
  align-items: flex-end;
  justify-content: end;
}

.form-item-inline {
  margin-right: 10px;
  margin-bottom: 0;
}

.form-item-inline:last-child {
  margin-right: 0;
}
</style>