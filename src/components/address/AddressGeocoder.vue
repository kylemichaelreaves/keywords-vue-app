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
                    v-bind:type="!canSubmit ? 'warning' : 'primary'"
                    @click="submitForm"
                    :loading="isFetching"
                    :disabled="!canSubmit"
            >
                Submit
            </el-button>
        </el-form>
    </form>

</template>

<script lang="ts">
import {ref, computed, defineComponent, watch} from 'vue';
import AddressList from "./AddressList.vue";
import useGeocodeAddress from "../..//api/hooks/addresses/useGeocodeAddress";
import {router} from "../../main";
import AddressResults from "./AddressResults.vue";
import {AddressFields} from "../../types";
import {Location} from "@element-plus/icons-vue";

export default defineComponent({
    name: 'AddressGeocoder',
    components: {
        Location,
        AddressList,
        AddressResults
    },
    setup() {
        const formData = ref<AddressFields>({
            streetAddress: '',
            unitOrAptNum: '',
            municipality: '',
            state: '',
            zipcode: ''
        })

        const canSubmit = computed(() => {
            return formData.value.streetAddress !== '' &&
                formData.value.municipality !== '' &&
                formData.value.state !== '';
        });

        const formFields = [
            {label: 'Street Address', prop: 'streetAddress', placeholder: 'Enter street address'},
            {label: 'Apt. Number', prop: 'aptNum', placeholder: 'Enter apt. number'},
            {label: 'Municipality', prop: 'municipality', placeholder: 'Enter municipality'},
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
            municipality: [
                {
                    required: true,
                    message: 'Please input your city, town, or municipality',
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

        const {isLoading, isFetching, isError, data, error, refetch} = useGeocodeAddress(formData.value)


        const submitForm = (event: Event) => {
            event.preventDefault();
            router.push({
                path: '/address-geocoder',
                query: {address: encodeURIComponent(JSON.stringify(formData.value))}
            })
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
            canSubmit,
            formFields
        }
    }
})
</script>

<style scoped>
.alert {
    margin-bottom: 10px;
}
</style>
