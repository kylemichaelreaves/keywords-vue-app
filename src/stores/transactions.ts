import {defineStore} from 'pinia'
import type {Memo, MJSummary, MonthYear, OFSummary, Summaries, WeekYear, DayYear} from "@types";
import {fetchDays} from "@api/transactions/fetchDays";
import {fetchWeeks} from "@api/transactions/fetchWeeks";
import {fetchMonths} from "@api/transactions/fetchMonths";
import {fetchMemos} from "@api/transactions/fetchMemos";
import {fetchOFAmountDebit} from "@api/transactions/fetchOFAmountDebit";
import {fetchMJAmountDebit} from "@api/transactions/fetchMJAmountDebit";
import {getDateNumberKey} from "@api/helpers/getDateNumberKey";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";

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
        weeks: Array<WeekYear>,
        months: Array<MonthYear>,
        memos: Array<Memo>,
        OFSummaries: Array<OFSummary>,
        MJSummaries: Array<MJSummary>,
        weekSummaries: Array<Summaries>,
        monthSummaries: Array<Summaries>,
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
        weeks: [],
        months: [],
        memos: [],
        OFSummaries: [],
        MJSummaries: [],
        weekSummaries: [],
        monthSummaries: [],
        transactionsCurrentPage: 1,
        transactionsPageSize: 100,
        filter: {},
        sort: {prop: '', order: ''},
        memoLimit: 100,
        memoOffset: 0,
        transactionsTableLimit: 100,
        transactionsTableOffset: 0,
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
        getWeeks: (state) => {
            return state.weeks
        },
        getMonths: (state) => {
            return state.months
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
        getWeekSummaries: (state) => {
            return state.weekSummaries
        },
        getMonthSummaries: (state) => {
            return state.monthSummaries
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
        setOFSummaries(summaries: Array<OFSummary>) {
            this.OFSummaries = summaries
        },
        setMJSummaries(summaries: Array<MJSummary>) {
            this.MJSummaries = summaries
        },
        setWeekSummaries(summaries: Array<Summaries>) {
            this.weekSummaries = summaries
        },
        setMonthSummaries(summaries: Array<Summaries>) {
            this.monthSummaries = summaries
        },
        async fetchDaysData() {
            await fetchDays().then((days) => {
                this.days = days;
            }).catch((err) => {
                console.log('err:', err);
                throw err;
            })
        },
        async fetchWeeksData() {
            await fetchWeeks().then((weeks) => {
                this.weeks = weeks;
            }).catch((err) => {
                console.log('err:', err);
                throw err;
            })
        },
        async fetchMonthsData() {
            await fetchMonths().then((months) => {
                this.months = months;
            }).catch((err) => {
                console.log('err:', err);
                throw err;
            })
        },
        async fetchPrevSummaries() {
            // TODO refactor dateType to account for year and day
            let dateType: 'month' | 'week' = 'month';
            let dateSummaries: Array<MonthYear | WeekYear> = [];
            let fetchOFSummary = fetchOFAmountDebit;
            let fetchMJSummary = fetchMJAmountDebit;
            let parsedDate;

            if (this.selectedMonth) {
                dateType = 'month';
                const currentIndex = this.months.findIndex(month => month.month_year === this.selectedMonth);
                dateSummaries = this.months.slice(currentIndex, currentIndex + 3);
                parsedDate = parseDateMMYYYY(this.selectedMonth)
            } else if (this.selectedWeek) {
                dateType = 'week';
                const currentIndex = this.weeks.findIndex(week => week.week_year === this.selectedWeek);
                dateSummaries = this.weeks.slice(currentIndex, currentIndex + 3);
                parsedDate = parseDateIWIYYY(this.selectedMonth)
            }

            for (let date of dateSummaries) {
                const OFsummary = await fetchOFSummary(dateType, parsedDate);
                const MJSummary = await fetchMJSummary(dateType, parsedDate);

                const dateNumberKey = getDateNumberKey(dateType);
                // only add if not already in array
                if (!this.OFSummaries.some(summary =>
                    summary.year === OFsummary.year && summary[dateNumberKey] === OFsummary[dateNumberKey])) {
                    this.OFSummaries = [...this.OFSummaries, OFsummary];
                }
                // only add if not already in array
                if (!this.MJSummaries.some(summary =>
                    summary.year === MJSummary.year && summary[dateNumberKey] === MJSummary[dateNumberKey])) {
                    this.MJSummaries = [...this.MJSummaries, MJSummary];
                }
            }
        },
        async fetchMemosData() {
            await fetchMemos().then((memos) => {
                this.memos = memos;
            }).catch((err) => {
                console.log('err:', err);
                throw err;
            })
        },
        async getTimeframe() {
            if (this.selectedMonth) {
                return 'month';
            } else if (this.selectedWeek) {
                return 'week';
            } else {
                return 'day';
            }
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
        }
    }

})
