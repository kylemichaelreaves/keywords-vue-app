<template>

</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useQuery} from "@tanstack/vue-query";
import axios from "axios";

export default {
  name: 'AddressGeocoder',
  setup() {
    const streetAddress = ref('')
    const aptNum = ref('')
    const city = ref('')
    const state = ref('')
    const zipCode = ref('')

    const fullAddress = computed(() => {
      if (aptNum && !zipCode) {
        return `${streetAddress} ${aptNum}, ${city}, ${state}`
      }
      if (zipCode && !aptNum) {
        `${streetAddress}, ${city}, ${state}, ${zipCode}`
      }
      if (aptNum && zipCode) {
        return `${streetAddress} ${aptNum}, ${city}, ${state}, ${zipCode}`
      }
    })

    const {isLoading, isFetching, isError,  data, error, retetch} = useQuery(
        // fullAddress should be a computed property of all the elements provided on the form, whatever they are
        ['address', fullAddress.value],
        () => geocodeAddress(fullAddress.value), {
          enabled: false
        }
    )
    return {}
  }
}

function geocodeAddress(address: string | undefined): Promise<any> {
  return typeof address === "undefined"
      ? Promise.reject(new Error("Address is undefined"))
      : axios.get('https://your-lambda-endpoint.com', {
        params: {
          address
        }
      });
}


</script>

<style scoped>
</style>
