import { defineStore } from 'pinia';
import type {
    Memo,
    MJSummary,
    MonthYear,
    OFSummary,
    Summaries,
    WeekYear,
    DayYear,
    Year,
    Transaction,
} from '@types';

export const useTransactionsStore = defineStore('transactions', {
    state: (): {
        selectedDay: string;
        selectedWeek: string;
        selectedMonth: string;
        selectedYear: string;
        selectedMemo: string;
        selectedType: string;
        selectedBudgetCategory: string | null;
        days: Array<DayYear>;
        daysForSelectedWeek: Array<string>;
        weeksForSelectedMonth: Array<string>;
        weeks: Array<WeekYear>;
        months: Array<MonthYear>;
        memos: Array<Memo>;
        years: Array<Year>;
        OFSummaries: Array<OFSummary>;
        MJSummaries: Array<MJSummary>;
        daysSummaries: Array<Summaries>;
        weeksSummaries: Array<Summaries>;
        monthsSummaries: Array<Summaries>;
        transactions: Array<Transaction>;
        transactionsCurrentPage: number;
        transactionsPageSize: number;
        filter: Record<string, string>;
        sort: { prop: string; order: string };
        memoLimit: number;
        memoOffset: number;
        transactionsTableLimit: number;
        transactionsTableOffset: number;
        transactionsByOffset: Record<number, Array<Transaction>>;
        transactionsCount: number;
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
        sort: { prop: '', order: '' },
        memoLimit: 100,
        memoOffset: 0,
        transactionsTableLimit: 100,
        transactionsTableOffset: 0,
        transactions: [],
        transactionsByOffset: {},
        transactionsCount: 0,
    }),
    getters: {
        getSelectedDay: (state) => state.selectedDay,
        getSelectedMonth: (state) => state.selectedMonth,
        getSelectedMemo: (state) => state.selectedMemo,
        getSelectedWeek: (state) => state.selectedWeek,
        getSelectedYear: (state) => state.selectedYear,
        getSelectedType: (state) => state.selectedType,
        getDays: (state) => state.days,
        getWeeks: (state) => state.weeks,
        getMonths: (state) => state.months,
        getYears: (state) => state.years,
        getMemos: (state) => state.memos,
        getOFSummaries: (state) => state.OFSummaries,
        getMJSummaries: (state) => state.MJSummaries,
        getDaysSummaries: (state) => state.daysSummaries,
        getWeeksSummaries: (state) => state.weeksSummaries,
        getMonthsSummaries: (state) => state.monthsSummaries,
        getTransactionsCurrentPage: (state) => state.transactionsCurrentPage,
        getTransactionsPageSize: (state) => state.transactionsPageSize,
        getFilter: (state) => state.filter,
        getSort: (state) => state.sort,
        getMemoLimit: (state) => state.memoLimit,
        getMemoOffset: (state) => state.memoOffset,
        getSelectedBudgetCategory: (state) => state.selectedBudgetCategory,
        getTransactionsTableLimit: (state) => state.transactionsTableLimit,
        getTransactionsTableOffset: (state) => state.transactionsTableOffset,
        getDaysForSelectedWeek: (state) => state.daysForSelectedWeek,
        getTransactions: (state) => state.transactions,
        getTransactionsByOffset: (state) => (offset: number) => {
            return state.transactionsByOffset[offset] || [];
        },
        getAllTransactions: (state) => {
            return Object.values(state.transactionsByOffset).flat();
        },
        getTransactionsCount: (state) => state.transactionsCount,
    },
    actions: {
        setSelectedDay(selectedDay: string) {
            this.selectedDay = selectedDay;
        },
        setSelectedMonth(selectedMonth: string) {
            this.selectedMonth = selectedMonth;
        },
        setSelectedMemo(selectedMemo: string) {
            this.selectedMemo = selectedMemo;
        },
        setSelectedWeek(selectedWeek: string) {
            this.selectedWeek = selectedWeek;
        },
        setSelectedYear(selectedYear: string) {
            this.selectedYear = selectedYear;
        },
        setSelectedType(selectedType: string) {
            this.selectedType = selectedType;
        },
        setDays(days: Array<DayYear>) {
            this.days = days;
        },
        setMemos(memos: Array<Memo>) {
            this.memos = memos;
        },
        setMemoLimit(limit: number) {
            this.memoLimit = limit;
        },
        setMemoOffset(offset: number) {
            this.memoOffset = offset;
        },
        setMonths(months: Array<MonthYear>) {
            this.months = months;
        },
        setWeeks(weeks: Array<WeekYear>) {
            this.weeks = weeks;
        },
        setYears(years: Array<Year>) {
            this.years = years;
        },
        setOFSummaries(summaries: Array<OFSummary>) {
            this.OFSummaries = summaries;
        },
        setMJSummaries(summaries: Array<MJSummary>) {
            this.MJSummaries = summaries;
        },
        setDaysSummaries(summaries: Array<Summaries>) {
            this.daysSummaries = summaries;
        },
        setWeeksSummaries(summaries: Array<Summaries>) {
            this.weeksSummaries = summaries;
        },
        setMonthsSummaries(summaries: Array<Summaries>) {
            this.monthsSummaries = summaries;
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
        updateSort(sort: { prop: string; order: string }) {
            this.sort = sort;
        },
        setSelectedBudgetCategory(selectedBudgetCategory: string | null) {
            this.selectedBudgetCategory = selectedBudgetCategory;
        },
        setTransactionsTableLimit(limit: number) {
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
        },
        setTransactionsByOffset(offset: number, transactions: Array<Transaction>) {
            this.transactionsByOffset[offset] = transactions;
        },
        clearTransactionsByOffset() {
            this.transactionsByOffset = {};
        },
        setTransactionsCount(count: number) {
            this.transactionsCount = Number(count[0].transactions_count);
        },
    },
});
