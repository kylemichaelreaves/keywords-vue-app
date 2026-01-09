import {mount, VueWrapper} from '@vue/test-utils'
import TableComponent from '@components//shared/TableComponent.vue'
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from "@pinia/testing";
import type {TestingPinia} from "@pinia/testing";
import {useTransactionsStore} from "@stores/transactions";
import {vi, afterEach, beforeEach} from "vitest";

describe('TableComponent', () => {
    let store: TestingPinia;
    let wrapper: VueWrapper;
    let transactionsStore: ReturnType<typeof useTransactionsStore>;

    beforeEach(() => {
        store = createTestingPinia();
        transactionsStore = useTransactionsStore(store);

        // a data array whose length makes the ElPagination component appear
        const mockData = Array.from({length: 101}, (_, i) => `data${i + 1}`)

        wrapper = mount(TableComponent, {
            props: {
                tableData: mockData,
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
        transactionsStore.transactionsPageSize = 10;
        transactionsStore.transactionsCurrentPage = 1;
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

    // TODO these shouldn't be use the store but rather should use the state within the component
    it('updates page size when handleSizeChange is called', async () => {
        const store = useTransactionsStore();
        store.transactionsPageSize = 20
        // @ts-expect-error - Type testing
        await wrapper.vm.handleSizeChange(20)

        await wrapper.vm.$nextTick()

        // @ts-expect-error - Type testing
        expect(wrapper.vm.pageSize).toBe(20)

        // @ts-expect-error - Type testing
        expect(wrapper.vm.store.getTransactionsPageSize).toBe(20)
    })

    // TODO these shouldn't be use the store but rather should use the state within the component
    it('updates current page when handleCurrentChange is called', async () => {
        const store = useTransactionsStore();

        store.transactionsCurrentPage = 1

        const _table = wrapper.findComponent({name: 'TableComponent'})

        // console.log('pagination.vm', pagination.vm);

        store.transactionsCurrentPage = 2

        // @ts-expect-error - Type testing
        await wrapper.vm.handleCurrentChange(2)

        await wrapper.vm.$nextTick()

        // @ts-expect-error - Type testing
        expect(wrapper.vm.currentPage).toBe(2)

        expect(store.getTransactionsCurrentPage).toBe(2)
    })
})