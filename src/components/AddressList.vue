<template>
  <div>
    <el-card v-if="data.length > 0" v-for="item in data" :key="item.id">
      <template #header>
        <div class="card-header">{{ item.name }}</div>
      </template>

      <p>{{ item.description }}</p>

    </el-card>
    <el-alert v-else type="error" title="No data to display"></el-alert>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, onMounted} from 'vue';


const AddressList = defineComponent({
  name: 'AddressList',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const {data} = props;
    return {data};
  }
});

export default AddressList;
</script>
