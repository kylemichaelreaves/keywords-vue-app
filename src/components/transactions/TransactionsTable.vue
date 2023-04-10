<template>
    <el-table
            :row-key="row => row['Transaction Number']"
            v-if="data"
            :isFetching="isFetching"
            :data="data"
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
            <template v-else #default="scope">
                {{ scope.row[columnKey] }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Transaction} from "../../types";

const transactionsTableProps = {
    data: {
        type: Object as () => Array<Transaction>,
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
        type: Array,
        required: false,
        default: () => []
    },
    isFetching: {
        type: Boolean,
        required: true,
        default: false
    }
} as const;

const TransactionsTable = defineComponent({
    props: transactionsTableProps,
    setup(props) {

        const {data, LIMIT, OFFSET, columnKeys, isFetching} = props;

        return {
            data,
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
