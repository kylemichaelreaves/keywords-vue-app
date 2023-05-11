<template>
    <el-table :data="transformedData" stripe table-layout="auto" :show-header="false" style="width: 100%">
        <el-table-column prop="key" label="Key">
            <template #default="{ row }">
                <span class="key-cell">{{ formatKey(row.key) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="value" label="Value"></el-table-column>
    </el-table>
</template>

<script lang="ts">
import {defineComponent, computed} from "vue";
import {formatKey} from "../../api/helpers/dataUtils";

export default defineComponent({
    name: "AddressResultFieldsTable",
    props: {
        address: {
            type: Object,
            default: () => ({}),
            required: true,
        },
    },
    setup(props) {

        const transformedData = computed(() => {
            return Object.entries(props.address).map(([key, value]) => ({
                key,
                value,
            }));
        });

        return {transformedData, formatKey};
    },
});

</script>

<style scoped>
.key-cell {
    font-weight: bold;
    color: blue;
}
</style>
