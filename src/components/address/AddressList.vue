<template>
    <div v-if="addresses.length > 0">
        <el-card v-for="item in addresses" :key="item.id">
            <template #header>
                <div class="card-header">{{ item.name }}</div>
            </template>
            <p>{{ item.description }}</p>
        </el-card>
    </div>
    <el-alert v-else type="error" title="Error: {{error}}"></el-alert>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'AddressList',
    props: {
        error: {
            type: String,
            default: '',
            required: false,
        },
        addresses: {
            type: Array,
            default: () => [],
            required: true,
            items: {
                type: Object
            }
        }
    },
    setup() {
        return {};
    }
});

</script>
