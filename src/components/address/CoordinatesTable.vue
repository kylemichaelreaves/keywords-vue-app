<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="latitude" label="Latitude"></el-table-column>
    <el-table-column prop="longitude" label="Longitude"></el-table-column>
  </el-table>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';
import {ElTable, ElTableColumn} from 'element-plus';


interface Coordinates {
  latitude: number;
  longitude: number;
}

export default defineComponent({
  name: 'CoordinatesTable',
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    coordinates: {
      type: Object as PropType<Coordinates>,
      required: true,
    },
  },
  setup(props: { coordinates: Coordinates }) {
    const tableData = [props.coordinates];
    return {tableData};
  },
});
</script>

<style scoped>
</style>
