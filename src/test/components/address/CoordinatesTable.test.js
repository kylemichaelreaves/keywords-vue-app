"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_utils_1 = require("@vue/test-utils");
var CoordinatesTable_vue_1 = require("../../../components/address/CoordinatesTable.vue");
var element_plus_1 = require("element-plus");
describe('CoordinatesTable.vue', function () {
    test('renders the CoordinatesTable with the provided latitude and longitude', function () {
        var latitude = "40.7128";
        var longitude = -"74.0060";
        var wrapper = (0, test_utils_1.mount)(CoordinatesTable_vue_1.default, {
            props: {
                coordinates: {
                    latitude: latitude,
                    longitude: longitude
                },
            },
            global: {
                components: {
                    ElTable: element_plus_1.ElTable,
                    ElTableColumn: element_plus_1.ElTableColumn
                }
            }
        });
        // Check if the table is rendered
        expect(wrapper.findComponent(element_plus_1.ElTable).exists()).toBe(true);
        // Check if the correct number of columns is rendered
        var columns = wrapper.findAllComponents(element_plus_1.ElTableColumn);
        var columnsLabels = columns.map(function (columnWrapper) { return columnWrapper.vm.label; });
        expect(columns.length).toBe(2);
        // Check if the correct column labels are rendered
        expect(columnsLabels[0]).toBe('Latitude');
        expect(columnsLabels[1]).toBe('Longitude');
        // Check if the correct data is displayed in the table
        var elTable = wrapper.findComponent(element_plus_1.ElTable);
        var tableData = elTable.props('data');
        expect(tableData).toHaveLength(1);
        expect(tableData[0].latitude).toBe(latitude);
        expect(tableData[0].longitude).toBe(longitude);
    });
});
