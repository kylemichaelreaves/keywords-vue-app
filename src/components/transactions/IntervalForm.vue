<template>
  <!--  TODO display alert when interval exceeds earliest date whose @close resets the interval state -->
<!--  <AlertComponent-->
<!--      title="Interval Exceeds Oldest Transaction"-->
<!--      message="Your requested interval exceeds the oldest dated transaction. Please choose a smaller interval."-->
<!--      type="error"-->
<!--      v-if="isDisabled"-->
<!--      @close="onClose"-->
<!--  />-->
  <el-form label-position="top">
    <div class="form-row">
      <el-form-item label="Interval Count" class="form-item-inline">
        <el-input-number
            data-testid="interval-input-number"
            v-model="numberInput"
            :min="1"
            :max="100"
            :step="1"
            @change="handleNumberInputChange"
            controls-position="right"
            class="input-number-inline"
        />
      </el-form-item>
      <el-form-item label="Interval Type" class="form-item-inline">
        <el-select
            data-testid="interval-type-select"
            v-model="intervalSelect"
            placeholder="Select interval"
            class="select-inline"
            clearable
            @clear="onClearIntervalSelect"
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
import {ref, computed, watch} from "vue";
import useOldestTransactionDate from "@api/hooks/transactions/useOldestTransactionDate";
import {DateTime} from "luxon";
import AlertComponent from "@components/shared/AlertComponent.vue";

const intervalSelect = ref("months");
const numberInput = ref(1);

const intervalValue = computed(() => {
  if (intervalSelect.value && numberInput.value) {
    return `${numberInput.value} ${intervalSelect.value}`;
  }
  return null;
});


const {data, error, isError, isLoading, isFetching} = useOldestTransactionDate();


const oldestDate = computed(() => {
  if (data.value) {
    return DateTime.fromISO(data.value);
  }
  return null;
});

const mostRecentTransaction = computed(() => {
  // TODO: replace with actual most recent transaction date from the store
  return DateTime.fromISO("2024-10-31");
});

// Check if the interval exceeds the oldest transaction date range
const isDisabled = computed(() => {
  if (!oldestDate.value || !intervalValue.value) return true;

  const subtractedDate = mostRecentTransaction.value.minus({[intervalSelect.value]: numberInput.value});

  return subtractedDate < oldestDate?.value;
});

const emit = defineEmits(["update:intervalValue"]);

const handleNumberInputChange = (value: number) => {
  numberInput.value = value;
}

const onClose = () => {
  intervalSelect.value = "months";
  numberInput.value = 3;
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

watch(intervalValue, (newVal) => {
  if (newVal) {
    emit("update:intervalValue", newVal);
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
