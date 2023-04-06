<template>
    <el-table
        :row-key="row => row.transactionNumber"
        :loading="isFetching"
        v-if="displayData"
        :data="displayData.rows"
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
            <template v-if="linkedColumns.includes(columnKey)" #default="scope">
                <router-link :to="`/transactions/${scope[columnKey]}`">{{ scope[columnKey] }}</router-link>
            </template>
            <template v-else #default="scope">
                {{ scope }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { Transaction } from "../../types";

const transactionsTableProps = {
    displayData: {
        type: Object as () => { rows: Array<Transaction> },
        default: () => ({ rows: [] }),
    },
    isFetching: {
        type: Boolean,
        required: true,
    },
    linkedColumns: {
        type: Array,
        required: true,
        default: () => [],
    },
} as const;

const TransactionsTable = defineComponent({
    props: transactionsTableProps,
    setup(props) {
        const columnKeys = computed(() => {
            if (props.displayData.rows.length > 0) {
                return Object.keys(props.displayData.rows[0]);
            } else {
                return [];
            }
        });

        return {
            columnKeys,
            isFetching: props.isFetching,
            linkedColumns: props.linkedColumns,
            displayData: props.displayData,
        };
    },
});

export default TransactionsTable;
</script>

<style scoped>
</style>
