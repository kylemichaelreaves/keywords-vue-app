<template>
  <el-table :data="data" table-layout="fixed">
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
    >
      <template #default="scope">
        <CoordinatesTable
          v-if="column.prop === 'coordinates'"
          data-test="coordinates-table"
          :coordinates="{
            latitude: parseFloat(scope.row.lat),
            longitude: parseFloat(scope.row.lon),
          }"
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import AddressResultFieldsTable from './AddressResultFieldsTable.vue'
import CoordinatesTable from './CoordinatesTable.vue'

// Define the address response type
interface AddressResponse {
  lat: string
  lon: string
  display_name: string
  address: {
    house_number?: string
    road?: string
    town?: string
    village?: string
    county: string
    state: string
    'ISO3166-2-lvl4'?: string
    postcode?: string
    country: string
    country_code: string
  }
}

const props = defineProps<{
  message: AddressResponse[]
}>()

const data = ref(props.message)
computed(() => {
  if (props.message && props.message.length > 0) {
    const addresses = props.message.map((item: AddressResponse) => item.address)
    return addresses.map((address) => {
      return Object.entries(address).map(([key, value]) => {
        return { key, value }
      })
    })
  } else {
    return [[]]
  }
})
const columns = [
  { prop: 'display_name', label: 'Display Name' },
  { prop: 'coordinates', label: 'Coordinates' },
  { prop: 'address', label: 'Address' },
]
</script>
