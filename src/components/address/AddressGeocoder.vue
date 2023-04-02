<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <Location/>
    </el-icon>
    Geocoding Form
  </h2>
  <p>this form sends a request based on its inputs to an AWS Lambda</p>
  <p>Based on what is returned, another component will be populated with its data, or an alert will display</p>
  <el-alert v-if="error" type="error" title="Error">
    <h2>
      {{ error.message }}
    </h2>
  </el-alert>
  <AddressResults v-if="data" :message="data"/>
  <form @submit.prevent="submitForm" novalidate>
    <el-form
        :model="formData"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="left"
        @keyup.enter="submitForm"
    >
      <div v-for="field in formFields" :key="field.label">
        <el-form-item :label="field.label" :prop="field.prop">
          <el-input v-model="formData[field.prop]" :placeholder="field.placeholder"></el-input>
        </el-form-item>
      </div>
      <el-button
          v-bind:type="formIsValid ? 'primary' : 'warning'"
          @click="submitForm"
          :loading="isFetching"
          :disabled="!formIsValid">
        Submit
      </el-button>
    </el-form>
  </form>

</template>

<script lang="ts">
import {ref, computed, defineComponent, watch} from 'vue';
import AddressList from "./AddressList.vue";
import {useQuery} from "@tanstack/vue-query";
import axios from "axios";
import {fetchAddress} from "../../api/address/fetchAddress";
import {router} from "../../main";
import AddressResults from "./AddressResults.vue";
import {API_GATEWAY_URL} from "../../constants";
import {AddressResponse} from "../../types";

interface FormData {
  streetAddress: string;
  aptNum?: string;
  city: string;
  state: string;
  zipCode?: string;
}

const AddressGeocoder = defineComponent({
  name: 'AddressGeocoder',
  components: {
    AddressList,
    AddressResults
  },
  setup() {
    const formData = ref<FormData>({
      streetAddress: '',
      aptNum: '',
      city: '',
      state: '',
      zipCode: ''
    })

    const formFields = [
      {label: 'Street Address', prop: 'streetAddress', placeholder: 'Enter street address'},
      {label: 'Apt. Number', prop: 'aptNum', placeholder: 'Enter apt. number'},
      {label: 'City', prop: 'city', placeholder: 'Enter city'},
      {label: 'State', prop: 'state', placeholder: 'Enter state'},
      {label: 'Zip Code', prop: 'zipCode', placeholder: 'Enter zip code'}];

    const rules = {
      streetAddress: [
        {
          required: true,
          message: 'Please input your street address',
          trigger: 'blur'
        }
      ],
      city: [
        {
          required: true,
          message: 'Please input your city',
          trigger: 'blur'
        }
      ],
      state: [
        {
          required: true,
          message: 'Please input your state',
          trigger: 'blur'
        }
      ]
    }


    watch([
      () => formData.value
    ], (newValue, oldValue) => {
      console.log(`Object updated:`, oldValue, '=>', newValue)
    }, {deep: true})


    const formIsValid = computed(() => {
      return formData.value.streetAddress && formData.value.city && formData.value.state
    })


    const {isLoading, isFetching, isError, data, error, refetch} = useQuery<AddressResponse[]>(
        ['address', formData.value],
        // TS2345: Argument of type '{ streetAddress: string; aptNum?: string | undefined; city: string; state: string; zipCode?: string | undefined; }' is not assignable to parameter of type 'FormData'.   Type '{ streetAddress: string; aptNum?: string | undefined; city: string; state: string; zipCode?: string | undefined; }' is missing the following properties from type 'FormData': append, delete, get, getAll, and 3 more.
        () => fetchAddress(formData.value), {
          enabled: false,
          staleTime: 1000 * 60 * 60 * 24,
        }
    )

    const submitForm = (event: Event) => {
      event.preventDefault();
      router.push({path: '/address-geocoder', query: {address: encodeURIComponent(JSON.stringify(formData.value))}})
      refetch()
    }

    return {
      isLoading,
      isFetching,
      isError,
      data,
      error,
      refetch,
      formData,
      rules,
      submitForm,
      formIsValid,
      formFields
    }
  }
})

export default AddressGeocoder;
</script>

<style scoped>
.alert {
  margin-bottom: 10px;
}
</style>
