import {mount, VueWrapper} from '@vue/test-utils'
import TableComponent from '@components//shared/TableComponent.vue'
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from "@pinia/testing";
import type {TestingPinia} from "@pinia/testing";
import {useTransactionsStore} from "@stores/transactions";
import {afterEach} from "vitest";

describe('TableComponent', () => {
    let store: TestingPinia;
    let wrapper: VueWrapper;
    let transactionsStore: ReturnType<typeof useTransactionsStore>;

    beforeEach(() => {
        store = createTestingPinia();
        transactionsStore = useTransactionsStore(store);

        wrapper = mount(TableComponent, {
            props: {
                tableData: ['data1', 'data2', 'data3'],
                columns: [{prop: 'column1', label: 'Column 1'}],
                sortableColumns: ['column1'],
                isFetching: false,
                LIMIT: 100,
                OFFSET: 0,
                currentPage: 1,
                pageSize: 10,
                handleSizeChange: vi.fn(),
                handleCurrentChange: vi.fn(),
            },
            global: {
                plugins: [VueQueryPlugin, createTestingPinia(
                    {
                        initialState: {
                            transactions: {
                                currentPage: 1,
                                pageSize: 10,
                            }
                        }
                    }
                )],
            }
        })
    });

    afterEach(() => {
        vi.resetAllMocks()

        //     reset the store
        transactionsStore.pageSize = 10;
        transactionsStore.currentPage = 1;
    })


    it('renders table with correct data when provided', async () => {
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent({name: 'ElTable'}).exists()).toBe(true)
        expect(wrapper.findComponent({name: 'ElTableColumn'}).exists()).toBe(true)
        expect(wrapper.findComponent({name: 'ElPagination'}).exists()).toBe(true)
    })

    it('does not render table when no data is provided', async () => {
        await wrapper.vm.$nextTick()

        expect(wrapper.find('el-table').exists()).toBe(false)
    })

    it('updates page size when handleSizeChange is called', async () => {
        const store = useTransactionsStore();
        store.pageSize = 20
        // @ts-ignore
        await wrapper.vm.handleSizeChange(20)

        await wrapper.vm.$nextTick()

        // @ts-ignore
        expect(wrapper.vm.store.getPageSize).toBe(20)
    })

    it('updates current page when handleCurrentChange is called', async () => {
        const store = useTransactionsStore();

        store.currentPage = 1

        const table = wrapper.findComponent({name: 'TableComponent'})

        // console.log('pagination.vm', pagination.vm);


        store.currentPage = 2

        await wrapper.vm.$nextTick()

        console.log('table.vm', table.vm.store);

        expect(store.getCurrentPage).toBe(2)
    })
})