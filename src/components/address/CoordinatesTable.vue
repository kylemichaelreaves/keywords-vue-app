<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="latitude" label="Latitude"></el-table-column>
    <el-table-column prop="longitude" label="Longitude"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

interface Coordinates {
  latitude: number
  longitude: number
}

const props = defineProps<{
  coordinates: Coordinates
}>()

const tableData = computed(() => [props.coordinates])
</script>
