<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="latitude" label="Latitude"></el-table-column>
        <el-table-column prop="longitude" label="Longitude"></el-table-column>
    </el-table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';


interface Coordinate {
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
            type: Object as PropType<Coordinate>,
            required: true,
        },
    },
    setup(props: {coordinates: Coordinate}) {
        const tableData = [props.coordinates];
        return { tableData };
    },
});
</script>

<style scoped>
</style>
