<template>
  <template v-if="props.addresses.length > 0">
    <el-card v-for="(item, index) in props.addresses" :key="item.id || index">
      <template #header>
        <div class="card-header">{{ item.name }}</div>
      </template>
      <p>{{ item.description }}</p>
    </el-card>
  </template>
  <el-alert v-else type="error" :title="`Error: ${props.error}`"></el-alert>
</template>

<script setup lang="ts">
interface AddressItem {
  id: string | number
  name: string
  description: string
}

interface Props {
  error?: string
  addresses: AddressItem[]
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  addresses: () => [],
})
</script>
