<template>
  <el-form :model="form" label-position="top">
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
        />
      </el-form-item>
      <el-form-item label="Interval Type" class="form-item-inline">
        <el-select
            v-model="intervalSelect"
            placeholder="Select interval"
            class="select-inline"
            clearable
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
import {ref, reactive, computed, watch} from "vue";

const intervalSelect = ref("months");
const numberInput = ref(3);

const intervalValue = computed(() => {
  if (intervalSelect.value && numberInput.value) {
    return `${numberInput.value} ${intervalSelect.value}`;
  }
  return "";
});


const emit = defineEmits(["update:interval"]);


const form = reactive({
  interval: "",
  number: 1
});

const handleNumberInputChange = (value: number) => {
  numberInput.value = value;
}

const selectOptions = computed(() => {
  if (numberInput.value === 1) {
    return [
      {value: "day", label: "Day"},
      {value: "week", label: "Week"},
      {value: "month", label: "Month"},
      {value: "year", label: "Year"},
    ];
  } else {
    return [
      {value: "days", label: "Days"},
      {value: "weeks", label: "Weeks"},
      {value: "months", label: "Months"},
      {value: "years", label: "Years"},
    ];
  }
});

watch(
    () => selectOptions.value,
    (newOptions) => {
      const values = newOptions.map((option) => option.value);
      if (!values.includes(intervalSelect.value)) {
        intervalSelect.value = "";
      }
    }
);

watch(intervalValue, (newVal) => {
  if (newVal) {
    emit("update:interval", newVal);
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
