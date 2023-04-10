<template>
    <el-select
        ref="selectComponent"
        v-model="selectedMemo"
        placeholder="select Memo"
        @update:model-value="$emit('update:selectedMemo', $event)"
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
import {computed, defineComponent, ref} from 'vue'
import useMemos from "../../api/hooks/transactions/useMemos";
import {ElOption, ElSelect} from "element-plus";

export default defineComponent({
    name: "MemoSelect",
    components: {ElOption, ElSelect},
    props: {
        selectedMemo: {
            type: String,
            default: ''
        }
    },
    emits: ['update:selectedMemo'],
    setup() {
        const {data, isLoading, isFetching, isError, error} = useMemos()

        const selectedMemo = ref('');

        const memoOptions = computed(() => {
            if (!data.value) {
                return []
            }
            return data.value.map(item => ({
                value: item.Memo,
                label: item.Memo,
            }));
        });

        return {
            data,
            memoOptions,
            isLoading,
            isFetching,
            isError,
            error,
            selectedMemo
        }
    }
})
</script>

<style scoped>

</style>
