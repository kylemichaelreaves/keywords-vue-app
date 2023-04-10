<template>
    <el-select
        ref="selectComponent"
        v-model="selectedValue"
        :placeholder="placeholder"
        @update:model-value="$emit('update:selectedValue', $event)"
        :clearable="clearable"
        :filterable="filterable"
        filterable
        :style="style"
    >
        <el-option
            v-for="option in data"
            :key="option.month_year"
            :label="option.month_year"
            :value="option.month_year"
        />
    </el-select>
</template>

<script lang="ts">

import {defineComponent, ref} from "vue";
import {ElOption, ElSelect} from "element-plus";

export default defineComponent({
    name: "CustomSelect",
    components: {ElSelect, ElOption},
    props: {
        data: {
            type: Array,
            default: () => [],
            required: true
        },
        selectedValue: {
            type: String,
            default: '',
            required: true
        },
        placeholder: {
            type: String,
            default: '',
            required: true
        },
        clearable: {
            type: Boolean,
            default: true,
            required: true
        },
        filterable: {
            type: Boolean,
            default: true,
            required: true
        },
        style: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["update:selectedValue"],
    setup(props) {

        const selectedValue = ref('')

        return {
            selectedValue,
            placeholder: props.placeholder,
            clearable: props.clearable,
            filterable: props.filterable,
            style: props.style,
        }
    }
})
</script>

<style scoped>

</style>