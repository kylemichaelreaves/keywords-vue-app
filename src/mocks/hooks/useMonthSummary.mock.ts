import {ref} from 'vue';

export default function useMonthSummary() {
    return {
        data: ref([
            {
                memo: 'Memo: Test 1',
                monthlyAmountDebit: -300,
            },
            {
                memo: 'Memo: Test 2',
                monthlyAmountDebit: -100,
            },
        ]),
        isError: ref(false),
        refetch: jest.fn(),
        isFetching: ref(false),
        isLoading: ref(false),
        error: ref(null),
    };
}