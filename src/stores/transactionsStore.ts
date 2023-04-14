import {defineStore} from 'pinia'

export const useTransactionsStore = defineStore('transactions', {

    state: () => ({
        selectedMonth: '',
        selectedMemo: '',
    }),
    getters: {
        getSelectedMonth: (state) => {
            return state.selectedMonth
        },
        getSelectedMemo: (state) => {
            return state.selectedMemo
        }
    },
    actions: {
        setSelectedMonth(selectedMonth: string) {
            this.selectedMonth = selectedMonth
        },
        setSelectedMemo(selectedMemo: string) {
            this.selectedMemo = selectedMemo
        }
    }
})