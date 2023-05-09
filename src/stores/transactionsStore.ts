import {defineStore} from 'pinia'

export const useTransactionsStore = defineStore('transactions', {

    state: () => ({
        selectedMonth: '',
        selectedMemo: '',
        selectedWeek: ''
    }),
    getters: {
        getSelectedMonth: (state) => {
            return state.selectedMonth
        },
        getSelectedMemo: (state) => {
            return state.selectedMemo
        },
        getSelectedWeek: (state) => {
            return state.selectedWeek
        }
    },
    actions: {
        setSelectedMonth(selectedMonth: string) {
            this.selectedMonth = selectedMonth
        },
        setSelectedMemo(selectedMemo: string) {
            this.selectedMemo = selectedMemo
        },
        setSelectedWeek(selectedWeek: string) {
            this.selectedWeek = selectedWeek
        }
    }
})
