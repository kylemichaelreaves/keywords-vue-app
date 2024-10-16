<template>
  <el-form-item :label="field.label" :prop="field.prop">
    <el-tooltip v-if="field.tooltip" effect="dark" :content="field.tooltip" placement="top">
      <component
          :is="inputComponent"
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
          v-bind="inputNumberProps"
      />
    </el-tooltip>
    <component
        v-else
        :is="inputComponent"
        v-model="model[field.prop]"
        :placeholder="field.placeholder"
        v-bind="inputNumberProps"
    />
  </el-form-item>
</template>

<script lang="ts">
import {defineComponent, computed, ref} from 'vue';
import type { FormInstance } from 'element-plus'

export default defineComponent({
  name: 'FormFieldComponent',
  props: {
    field: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const inputComponent = computed(() => {
      if (props.field.type === 'date') {
        return 'el-date-picker';
      } else if (props.field.type === 'number') {
        return 'el-input-number';
      } else {
        return 'el-input';
      }
    });

    const formRef = ref<FormInstance>()

    const inputNumberProps = computed(() => {
      if (props.field.type === 'number' && props.field.prop === 'loanTerm') {
        return {
          'controls-position': 'right'
        };
      } else if (props.field.type === 'number' && props.field.prop === 'interestRate') {
        return {
          min: 0,
          max: 100,
          precision: 2,
          step: 0.10,
          'controls-position': 'right'
        };
      } else if (props.field.type === 'number') {
        return {
          min: 0,
          // max: 100,
          precision: 2,
          'controls-position': 'right'
        };
      } else {
        return {};
      }
    });



    return {
      inputComponent,
      inputNumberProps
    };
  }
});
</script>