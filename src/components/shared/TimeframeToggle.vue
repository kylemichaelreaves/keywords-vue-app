<template>
    <div class="time-selector">
        <el-check-tag
                v-for="option in options"
                :key="option.value"
                v-model="selectedOption"
                :label="option.value"
                @change="handleChange($event)"
        >
            {{ option.label }}
        </el-check-tag>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {ElCheckTag} from "element-plus";

export default defineComponent({
    name: "TimeframeToggle",
    components: {
      ElCheckTag
    },
    setup() {
        const options = [
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
        ];

        const selectedOption = ref(options[1].value);

        const handleChange = (newValue: string) => {
            selectedOption.value = newValue;
        };

        return {selectedOption, handleChange, options};
    }
})
</script>

<style scoped>
</style>