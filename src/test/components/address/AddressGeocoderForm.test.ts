import {vi, test} from 'vitest'
import {mount} from '@vue/test-utils'
import AddressGeocoderForm from "../../../components/address/AddressGeocoderForm.vue";
import {ElButton, ElInput} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from "@pinia/testing";

describe('AddressGeocoderForm', () => {
    vi.mock("element-plus/theme-chalk/base.css", () => ({}));


    const _wrapper = mount(AddressGeocoderForm, {
        global: {
            plugins: [ElInput, ElButton, VueQueryPlugin, createTestingPinia()],
        }
    });

    test('renders the form with input fields', async () => {

        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.findAll('input[type="text"]').length).toBe(5);
    });

    test('disables submit button when required fields are empty', async () => {

        const submitButton = wrapper.findComponent(ElButton);

        console.log('submitButton.vm.disabled', submitButton.vm.disabled)

        expect(submitButton.vm.disabled).toBe(true);

        expect(submitButton.vm.disabled).toBeTruthy();
    });

    test('enables submit button when required fields are filled', async () => {

        const submitButton = wrapper.findComponent(ElButton);;

        await wrapper.get('input[placeholder="Enter street address"]').setValue('123 Main St');
        await wrapper.get('input[placeholder="Enter municipality"]').setValue('New York');
        await wrapper.get('input[placeholder="Enter state"]').setValue('NY');

        expect(submitButton.vm.disabled).toBeFalsy();
    });


});
