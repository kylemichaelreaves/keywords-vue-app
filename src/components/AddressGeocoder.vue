<template>
  <h2>
    <el-icon size="large">
      <Location/>
    </el-icon>
    Geocoding Form
  </h2>
  <p>this form sends a request based on its inputs to an AWS Lambda</p>
  <p>Based on what is returned, another component will be populated with its data, or an alert will display</p>
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
  <!--    if data…rendering it in the AddressesList-->
  <AddressList v-if="!isError && data" :addresses="data.addresses"/>

</template>

<script lang="ts">
import {ref, computed, defineComponent, watch} from 'vue';
import AddressList from "./AddressList.vue";
import {useQuery} from "@tanstack/vue-query";
import axios from "axios";
import {router} from "../main";

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
    AddressList
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


    // const fullAddress = computed(() => {
    //   return `${formData.value.streetAddress} ${formData.value.aptNum
    //       ? formData.value.aptNum
    //       : ""}, ${formData.value.city}, ${formData.value.state} ${formData.value.zipCode
    //       ? formData.value.zipCode
    //       : ""}`
    // })

    watch([
      () => formData.value
    ], (newValue, oldValue) => {
      console.log(`Object updated:`, oldValue, '=>', newValue)
    }, {deep: true})


    const formIsValid = computed(() => {
      return formData.value.streetAddress && formData.value.city && formData.value.state
    })

    const URL = import.meta.env.VITE_APIGATEWAY_URL as string;
    console.log(`URL: ${URL}`)


    // TODO handle onEnter keypress


    const geocodeAddress = async (address: FormData | undefined): Promise<any> => {
      return typeof address === "undefined"
          ? Promise.reject(new Error("Address is undefined"))
          : await axios.get(`${URL}/address-geocoder?${address}`)
              .then((response) => {
                console.log(`response: ${JSON.stringify(response)}`)
                return response.data
              })
              .catch((error) => {
                console.log(`error: ${JSON.stringify(error)}`)
                return error
              })
    }
    const {isLoading, isFetching, isError, data, error, refetch} = useQuery(
        ['address', formData.value],
        () => geocodeAddress(formData.value), {
          enabled: false
        }
    )

    const submitForm = (event: Event) => {
      event.preventDefault();
      console.log(`fullAddress.value: ${JSON.stringify(formData.value)}`)
      console.log(`formData.value: ${JSON.stringify(formData.value)}`)
      // router.push({path: '/address-geocoder', params: {address: formData.value}})
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
</style>
