import {test} from 'vitest'
import {mount} from '@vue/test-utils'
import {ElTable, ElTableColumn} from "element-plus";
import AddressResultFieldsTable from "../../../components/address/AddressResultFieldsTable.vue";
describe('AddressResultFieldsTable', () => {
    const wrapper = mount(AddressResultFieldsTable, {
        global: {
            plugins: [ElTable, ElTableColumn]
        }
    })

    test('renders the table with the correct number of rows', () => {

    })

})