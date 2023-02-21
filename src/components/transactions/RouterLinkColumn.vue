<template>
  <el-table-column :key="column.title" :prop="column.key" :label="column.title">
    <template v-if="isRouterLink">
      <router-link :to="to">{{ value }}</router-link>
    </template>
    <template v-else>
      {{ value }}
    </template>
  </el-table-column>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
const RouterLinkColumn = defineComponent({
  name: "RouterLinkColumn",
  props: {
    row: Object,
    column: {
      type: Object, // Define the type of the `column` prop as Object
      default: () => ({ title: "", key: "" }) // Set default value as an empty object
    },
  },
  setup(props) {
    const isRouterLink = computed(() =>
        props.column.key === "Memo" || props.column.key === "Date");

    const value = computed(() => props.row?[props.column.key] : "");

    function formatDate(dateString: string | number | Date) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
    }

    const to = computed(() => {
      if (props.column.key === "Memo") {
        return {name: "transactions", query: {memo: value.value}};
      } else if (props.column.key === "Date") {
        return {name: "transactions", query: {month: value.value}};
      }
    });
  return {isRouterLink, value, to};
  }
});
export default RouterLinkColumn;
</script>

<style scoped>

</style>