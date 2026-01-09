import {mount} from '@vue/test-utils'
import {test} from 'vitest'
import AddressResults from "../../../components/address/AddressResults.vue";
import AddressResultFieldsTable from "../../../components/address/AddressResultFieldsTable.vue";
import CoordinatesTable from "../../../components/address/CoordinatesTable.vue";

describe('AddressResults.vue', () => {
    const testData = [
        {
            display_name: 'Sample Location',
            lat: 123.456,
            lon: 789.012,
            address: {
                house_number: '123',
                road: 'Main St',
                town: 'Sampletown',
                county: 'Sample County',
                state: 'Sample State',
                'ISO3166-2-lvl4': 'ABCD',
                postcode: '12345',
                country: 'Sample Country',
                country_code: 'SC',
            },
        },
    ];

    test('renders AddressResults component', async () => {
        const wrapper = mount(AddressResults, {
            props: {
                message: testData,
            },
            global: {
                stubs: {
                    "el-table": {
                        template: "<div><slot /></div>",
                    },
                    "el-table-column": {
                        template: "<div><slot name='default' v-bind='scope' /></div>",
                        props: ["prop"],
                        setup(_props) {
                            return {
                                scope: {
                                    row: testData[0],
                                },
                            };
                        },
                    },
                },
            },
        });

        await wrapper.vm.$nextTick();

        const displayName = wrapper.find('[data-test="display-name"]');
        const coordinatesTable = wrapper.findComponent(CoordinatesTable);
        const addressResultFieldsTable = wrapper.findComponent(AddressResultFieldsTable);

        expect(displayName.text()).toBe('Sample Location');
        expect(coordinatesTable.exists()).toBe(true);
        expect(coordinatesTable.props('coordinates')).toEqual({ latitude: 123.456, longitude: 789.012 });
        expect(addressResultFieldsTable.exists()).toBe(true);
        expect(addressResultFieldsTable.props('address')).toEqual(testData[0].address);
    });
})