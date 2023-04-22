import {mount} from '@vue/test-utils'
import CoordinatesTable from "../../../components/address/CoordinatesTable.vue";
import {ElTable, ElTableColumn} from "element-plus";

describe('CoordinatesTable.vue', () => {
    test('renders the CoordinatesTable with the provided latitude and longitude', () => {
        const latitude = 40.7128;
        const longitude = -74.0060;
        const wrapper = mount(CoordinatesTable, {
            props: {
                coordinates: {
                    latitude: latitude,
                    longitude: longitude
                },
            },
            global: {
                components: {
                    ElTable, ElTableColumn
                }
            }
        });

        // Check if the table is rendered
        expect(wrapper.findComponent(ElTable).exists()).toBe(true);

        // Check if the correct number of columns is rendered
        const columns = wrapper.findAllComponents(ElTableColumn);

        const columnsLabels = columns.map(columnWrapper => columnWrapper.vm.label);

        expect(columns.length).toBe(2);

        // Check if the correct column labels are rendered
        expect(columnsLabels[0]).toBe('Latitude');
        expect(columnsLabels[1]).toBe('Longitude');

        // Check if the correct data is displayed in the table
        const elTable = wrapper.findComponent(ElTable);
        const tableData = elTable.props('data');

        expect(tableData).toHaveLength(1);
        expect(tableData[0].latitude).toBe(latitude);
        expect(tableData[0].longitude).toBe(longitude);
    })
})
