<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <SelectComponent
      data-testid="description-select"
      :on-change="updateSelectedDescription"
      placeholder="select a description"
      :selectedValue="selectedDescription"
      :options="descriptionOptions"
      :disabled="disabledCondition.value"
  />
</template>

<script setup lang="ts">
import SelectComponent from "@components/shared/SelectComponent.vue";
import useDescriptions from "@api/hooks/transactions/useDescriptions";
import {computed} from "vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import {useTransactionsStore} from "@stores/transactions";

const {data, error, isError, isFetching, isLoading, isRefetching} = useDescriptions();

const store = useTransactionsStore();

const selectedDescription = computed(() => store.getSelectedDescription);

const updateSelectedDescription = (description: string) => {
  store.setSelectedDescription(description);
};

const disabledCondition = computed(() => {
  return isFetching || isLoading || isRefetching;
});


const descriptionOptions = computed(() => {
  if (!data.value) {
    return [];
  }
  return data.value.map((item: string) => ({
    value: item,
    label: item,
  }));
});

</script>

<style scoped>

</style>