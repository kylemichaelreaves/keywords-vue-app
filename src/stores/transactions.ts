import {defineStore} from 'pinia'
import type {Memo, MJSummary, MonthYear, OFSummary, Summaries, WeekYear, DayYear, Year, Transaction} from "@types";

export const useTransactionsStore = defineStore('transactions', {

    state: (): {
        selectedDay: string,
        selectedWeek: string,
        selectedMonth: string,
        selectedYear: string,
        selectedMemo: string,
        selectedType: string,
        selectedBudgetCategory: string,
        days: Array<DayYear>,
        daysForSelectedWeek: Array<string>,
        weeksForSelectedMonth: Array<string>,
        weeks: Array<WeekYear>,
        months: Array<MonthYear>,
        memos: Array<Memo>,
        years: Array<Year>,
        OFSummaries: Array<OFSummary>,
        MJSummaries: Array<MJSummary>,
        daysSummaries: Array<Summaries>,
        weeksSummaries: Array<Summaries>,
        monthsSummaries: Array<Summaries>,
        transactions: Array<Transaction>,
        transactionsCurrentPage: number,
        transactionsPageSize: number,
        filter: Record<string, string>,
        sort: { prop: string, order: string },
        memoLimit: number,
        memoOffset: number,
        transactionsTableLimit: number,
        transactionsTableOffset: number,
    } => ({
        selectedDay: '',
        selectedMonth: '',
        selectedYear: '',
        selectedMemo: '',
        selectedWeek: '',
        selectedType: 'Amount Debit',
        selectedBudgetCategory: '',
        days: [],
        daysForSelectedWeek: [],
        weeksForSelectedMonth: [],
        weeks: [],
        months: [],
        memos: [],
        years: [],
        OFSummaries: [],
        MJSummaries: [],
        daysSummaries: [],
        weeksSummaries: [],
        monthsSummaries: [],
        transactionsCurrentPage: 1,
        transactionsPageSize: 100,
        filter: {},
        sort: {prop: '', order: ''},
        memoLimit: 100,
        memoOffset: 0,
        transactionsTableLimit: 100,
        transactionsTableOffset: 0,
        transactions: []
    }),
    getters: {
        getSelectedDay: (state) => {
            return state.selectedDay
        },
        getSelectedMonth: (state) => {
            return state.selectedMonth
        },
        getSelectedMemo: (state) => {
            return state.selectedMemo
        },
        getSelectedWeek: (state) => {
            return state.selectedWeek
        },
        getSelectedYear: (state) => {
            return state.selectedYear
        },
        getSelectedType: (state) => {
            return state.selectedType
        },
        getDays: (state) => {
            return state.days
        },
        getWeeks: (state) => {
            return state.weeks
        },
        getMonths: (state) => {
            return state.months
        },
        getYears: (state) => {
            return state.years
        },
        getMemos: (state) => {
            return state.memos
        },
        getOFSummaries: (state) => {
            return state.OFSummaries
        },
        getMJSummaries: (state) => {
            return state.MJSummaries
        },
        getDaysSummaries: (state) => {
            return state.daysSummaries
        },
        getWeeksSummaries: (state) => {
            return state.weeksSummaries
        },
        getMonthsSummaries: (state) => {
            return state.monthsSummaries
        },
        getTransactionsCurrentPage: (state) => {
            return state.transactionsCurrentPage
        },
        getTransactionsPageSize: (state) => {
            return state.transactionsPageSize
        },
        getFilter: (state) => {
            return state.filter
        },
        getSort: (state) => {
            return state.sort
        },
        getMemoLimit: (state) => {
            return state.memoLimit
        },
        getMemoOffset: (state) => {
            return state.memoOffset
        },
        getSelectedBudgetCategory: (state) => {
            return state.selectedBudgetCategory
        },
        getTransactionsTableLimit: (state) => {
            return state.transactionsTableLimit
        },
        getTransactionsTableOffset: (state) => {
            return state.transactionsTableOffset
        },
        getDaysForSelectedWeek: (state) => {
            return state.daysForSelectedWeek
        },
        getTransactions: (state) => {
            return state.transactions
        }
    },
    actions: {
        setSelectedDay(selectedDay: string) {
            this.selectedDay = selectedDay
        },
        setSelectedMonth(selectedMonth: string) {
            this.selectedMonth = selectedMonth
        },
        setSelectedMemo(selectedMemo: string) {
            this.selectedMemo = selectedMemo
        },
        setSelectedWeek(selectedWeek: string) {
            this.selectedWeek = selectedWeek
        },
        setSelectedYear(selectedYear: string) {
            this.selectedYear = selectedYear
        },
        setSelectedType(selectedType: string) {
            this.selectedType = selectedType
        },
        setDays(days: Array<DayYear>) {
            this.days = days
        },
        setMemos(memos: Array<Memo>) {
            this.memos = memos
        },
        setMemoLimit(limit: number) {
            this.memoLimit = limit
        },
        setMemoOffset(offset: number) {
            this.memoOffset = offset
        },
        setMonths(months: Array<MonthYear>) {
            this.months = months
        },
        setWeeks(weeks: Array<WeekYear>) {
            this.weeks = weeks
        },
        setYears(years: Array<Year>) {
            this.years = years
        },
        setOFSummaries(summaries: Array<OFSummary>) {
            this.OFSummaries = summaries
        },
        setMJSummaries(summaries: Array<MJSummary>) {
            this.MJSummaries = summaries
        },
        setDaysSummaries(summaries: Array<Summaries>) {
            this.daysSummaries = summaries
        },
        setWeeksSummaries(summaries: Array<Summaries>) {
            this.weeksSummaries = summaries
        },
        setMonthsSummaries(summaries: Array<Summaries>) {
            this.monthsSummaries = summaries
        },
        updateTransactionsCurrentPage(currentPage: number) {
            this.transactionsCurrentPage = currentPage;
        },
        updateTransactionsPageSize(pageSize: number) {
            this.transactionsPageSize = pageSize;
        },
        updateFilter(filter: Record<string, string>) {
            this.filter = filter;
        },
        updateSort(sort: { prop: string, order: string }) {
            this.sort = sort;
        },
        setSelectedBudgetCategory(selectedBudgetCategory: string) {
            this.selectedBudgetCategory = selectedBudgetCategory;
        },
        updateTransactionsTableLimit(limit: number) {
            this.transactionsTableLimit = limit;
        },
        updateTransactionsTableOffset(offset: number) {
            this.transactionsTableOffset = offset;
        },
        setDaysForSelectedWeek(days: Array<string>) {
            this.daysForSelectedWeek = days;
        },
        setWeeksForSelectedMonth(weeks: Array<string>) {
            this.weeksForSelectedMonth = weeks;
        },
        setTransactions(transactions: Array<Transaction>) {
            this.transactions = transactions;
        }
    }

})
