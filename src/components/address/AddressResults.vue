<template>
    <el-table :data="data.message" table-layout="fixed">
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
            <template #default="scope">
                <CoordinatesTable 
                    v-if="column.prop === 'coordinates'" 
                    data-test="coordinates-table" 
                    :coordinates="{ latitude: scope.row.lat, longitude: scope.row.lon }"
                />
                <AddressResultFieldsTable 
                    v-else-if="column.prop === 'address'"
                    data-test="address-result-fields-table" 
                    :address="scope.row.address"
                />
                <span v-else-if="column.prop === 'display_name'" data-test="display-name">
                    {{ scope.row.display_name }}
                </span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import {ref, defineComponent, computed} from 'vue'
import AddressResultFieldsTable from "./AddressResultFieldsTable.vue";
import CoordinatesTable from "./CoordinatesTable.vue";

export default defineComponent({
    name: 'AddressResults',
    components: {CoordinatesTable, AddressResultFieldsTable},
    props: {
        message: {
            type: Array,
            required: true,
        },
    },
    setup(props) {

        const data = ref(props.message)

        const addressData = computed(() => {
            if (props.message && props.message.length > 0) {
                const addresses = props.message.map((item) => item.address);
                return addresses.map((address) => {
                    return Object.entries(address).map(([key, value]) => {
                        return {key, value};
                    });
                });
            } else {
                return [[]];
            }
        });

        const columns = [
            {prop: 'display_name', label: 'Display Name'},
            {prop: 'coordinates', label: 'Coordinates'},
            {prop: 'address', label: 'Address'}
        ]
        const addressColumns = [
            {prop: 'house_number', label: 'House Number'},
            {prop: 'road', label: 'Road'},
            {prop: 'town', label: 'Town'},
            {prop: 'county', label: 'County'},
            {prop: 'state', label: 'State'},
            {prop: 'postcode', label: 'Postcode'},
            {prop: 'country', label: 'Country'}
        ]

        return {data, columns, addressColumns, addressData}
    },
})

</script>

<style scoped>
</style>