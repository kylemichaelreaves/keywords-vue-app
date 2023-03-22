<template>
  <el-card v-if="addresses.length > 0" v-for="item in addresses" :key="item.id">
    <template #header>
      <div class="card-header">{{ item.name }}</div>
    </template>
    <p>{{ item.description }}</p>
  </el-card>
  <el-alert v-else type="error" title="Error: {{error}}"></el-alert>
</template>

<script lang="ts">
import {defineComponent} from "vue";

const AddressList = defineComponent({
  name: 'AddressList',
  props: {
    error: {
      type: String,
      default: ''
    },
    addresses: {
      type: Array,
      default: [{}],
      required: true,
      items: {
        type: Object
      }
    }
  },
  setup(props) {
    const {addresses} = props;
    return {addresses};
  }
});
export default AddressList;

</script>
