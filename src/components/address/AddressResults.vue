<template>
    <el-table :data="message">
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
            <template v-if="column.prop === 'address'" #default="scope">
                <el-table :data="scope.row.address" stripe>
                    <el-table-column
                            v-for="addressColumn in addressColumns"
                            :key="addressColumn.prop"
                            :prop="addressColumn.prop"
                            :label="addressColumn.label"
                    />
                </el-table>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import {ref, defineComponent} from 'vue'

const AddressResults = defineComponent({
    props: {
        message: {
            type: Array,
            required: true
        }
    },
    setup() {
        const columns = [
            {prop: 'display_name', label: 'Display Name'},
            {prop: 'lat', label: 'Latitude'},
            {prop: 'lon', label: 'Longitude'},
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
        return {columns, addressColumns}
    }
})

export default AddressResults
</script>

<style scoped>

</style>