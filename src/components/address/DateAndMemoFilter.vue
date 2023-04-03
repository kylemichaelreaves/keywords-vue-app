<template>
    <div>
        <el-select v-model="selectedMonth" placeholder="Select a month">
            <el-option v-for="month in uniqueMonthsObject" :key="month.value" :label="month.label" :value="month.value"></el-option>
        </el-select>
        <el-select v-model="selectedMemo" placeholder="Select a memo">
            <el-option v-for="memo in uniqueMemoObject" :key="memo.value" :label="memo.label" :value="memo.value"></el-option>
        </el-select>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
    name: "DateAndMemoFilter",
    props: {
        uniqueMonthsObject: {
            type: Array,
            required: true,
        },
        uniqueMemoObject: {
            type: Array,
            required: true,
        },
    },
    setup(_, { emit }) {
        const selectedMonth = ref("");
        const selectedMemo = ref("");

        watch(selectedMonth, (newValue) => {
            emit("update:selectedMonth", newValue);
        });

        watch(selectedMemo, (newValue) => {
            emit("update:selectedMemo", newValue);
        });

        return {
            selectedMonth,
            selectedMemo,
        };
    },
});
</script>

<style scoped>

</style>