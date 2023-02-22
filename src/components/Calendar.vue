<template>

  <el-calendar v-model="value"></el-calendar>

</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

const Calendar = defineComponent({
  name: "Calendar",
  setup() {
    const value = ref(new Date())
    return {value};
  }
})
export default Calendar;
</script>

<style scoped>

</style>