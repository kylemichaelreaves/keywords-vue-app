<template>
    <el-table
            :row-key="row => row['Transaction Number']"
            v-if="reactiveTableData"
            :loading="isFetching"
            :isFetching="isFetching"
            :data="reactiveTableData"
            style="width: 100%"
            table-layout="auto"
            height="auto"
            border
    >
        <el-table-column
                v-for="columnKey in columnKeys"
                :key="columnKey"
                :prop="columnKey"
                :label="columnKey"
        >
            <template v-if="columnKey === 'Transaction Number'" #default="scope">
                <router-link :to="`/transactions/${scope.row[columnKey]}`">
                    {{ scope.row[columnKey] }}
                </router-link>
            </template>
            <template v-else-if="columnKey === 'Date'" #default="scope">
                <div>
                    {{ formatDate(scope.row[columnKey]) }}
                </div>
            </template>
            <template v-else #default="scope">
                {{ scope.row[columnKey] }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import {computed, defineComponent, defineProps, watchEffect} from "vue";
import {Transaction} from "../../types";
import {formatDate, isDateSameAsPrevious} from "../../dataUtils";

const transactionsTableProps = {
    tableData: {
        type: Object as () => Transaction[],
        required: true,
        default: () => []
    },
    LIMIT: {
        type: Number,
        required: true,
        default: 100
    },
    OFFSET: {
        type: Number,
        required: true,
        default: 0
    },
    columnKeys: {
        type: Array as () => string[],
        required: false,
        default: () => []
    },
    isFetching: {
        type: Boolean,
        required: false,
        default: false
    }
} as const;

const TransactionsTable = defineComponent({
    methods: {isDateSameAsPrevious, formatDate},
    props: transactionsTableProps,
    setup(props) {

        const { LIMIT, OFFSET, columnKeys, isFetching} = props;

        const reactiveTableData = computed(() => props.tableData);

        return {
            reactiveTableData,
            LIMIT,
            OFFSET,
            columnKeys,
            isFetching
        };
    },
});

export default TransactionsTable;
</script>

<style scoped>
</style>
