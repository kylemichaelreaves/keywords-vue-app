<template>
    <el-select
        ref="selectComponent"
        v-model="selectedMemo"
        placeholder="select Memo"
        @update:model-value="updateSelectedMemo"
        clearable
        filterable
    >
        <el-option
            v-for="option in memoOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
        />
    </el-select>
</template>

<script lang='ts'>
import {computed, defineComponent, watch} from 'vue'
import useMemos from "../../api/hooks/transactions/useMemos";
import {ElOption, ElSelect} from "element-plus";
import {useTransactionsStore} from "../../stores/transactionsStore";

export default defineComponent({
    name: "MemoSelect",
    components: {ElOption, ElSelect},
    props: {
        selectedMemo: {
            type: String,
            default: ''
        }
    },
    setup() {

        const transactionsStore = useTransactionsStore()

        const selectedMemo = transactionsStore.getSelectedMemo;

        const selectedMonth = computed(() => transactionsStore.getSelectedMonth);

        const {data, isLoading, isFetching, isError, error, refetch} = useMemos()

        const memoOptions = computed(() => {
            if (!data.value) {
                return []
            }
            return data.value.map(item => ({
                value: item.Memo,
                label: item.Memo,
            }));
        });

        const updateSelectedMemo = (memo: string) => {
            transactionsStore.setSelectedMemo(memo)
        }

        watch(selectedMonth, (newMonth) => {
            refetch()
        })

        return {
            data,
            memoOptions,
            isLoading,
            isFetching,
            isError,
            error,
            selectedMemo,
            updateSelectedMemo
        }
    }
})
</script>

<style scoped>

</style>
