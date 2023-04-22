<template>
    <el-table :data="data.message" table-layout="fixed">
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
            <template v-if="column.prop === 'coordinates'" #default="scope">
                <CoordinatesTable data-test="coordinates-table" :coordinates="{ latitude: scope.row.lat, longitude: scope.row.lon }"/>
            </template>
            <template v-if="column.prop === 'address'" #default="scope">
                <AddressResultFieldsTable data-test="address-result-fields-table" :address="scope.row.address"/>
            </template>
            <template v-if="column.prop === 'display_name'" #default="scope">
                <span data-test="display-name">{{ scope.row.display_name }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import {ref, defineComponent, onMounted, computed} from 'vue'
import AddressResultFieldsTable from "./AddressResultFieldsTable.vue";
import CoordinatesTable from "./CoordinatesTable.vue";

interface Address {
    house_number: string;
    road: string;
    town: string;
    county: string;
    state: string;
    'ISO3166-2-lvl4': string;
    postcode: string;
    country: string;
    country_code: string;
}

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