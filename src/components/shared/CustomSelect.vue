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
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
        />
    </el-select>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {ElOption, ElSelect} from "element-plus";

export default defineComponent({
        name: "CustomSelect",
        components: {ElSelect, ElOption},
        props: {
            options: {
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
        return {
            selectedValue: props.selectedValue,
            placeholder: props.placeholder,
            clearable: props.clearable,
            filterable: props.filterable,
            style: props.style,
            options: props.options,
        }
    }
})
</script>

<style scoped>

</style>