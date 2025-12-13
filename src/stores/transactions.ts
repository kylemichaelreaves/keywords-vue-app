import { defineStore } from 'pinia'
import type {
  Memo,
  MonthYear,
  SummaryTypeBase,
  Summaries,
  WeekYear,
  DayYear,
  Year,
  Transaction,
  PendingTransaction,
} from '@types'

export const useTransactionsStore = defineStore('transactions', {
  state: (): {
    selectedDay: string
    selectedWeek: string
    selectedMonth: string
    selectedYear: string
    selectedMemoId: Memo['id']
    selectedType: string
    selectedDescription: string
    selectedBudgetCategory: string | null
    selectedStatus: 'pending' | 'reviewed'
    days: Array<DayYear>
    daysForSelectedWeek: Array<string>
    weeksForSelectedMonth: Array<string>
    weeks: Array<WeekYear>
    months: Array<MonthYear>
    memos: Array<Memo>
    years: Array<Year>
    descriptions: Array<string>
    OFSummaries: Array<SummaryTypeBase>
    MJSummaries: Array<SummaryTypeBase>
    daysSummaries: Array<Summaries>
    weeksSummaries: Array<Summaries>
    monthsSummaries: Array<Summaries>
    transactions: Array<Transaction>
    transactionsCurrentPage: number
    transactionsPageSize: number
    filter: Record<string, string>
    sort: { prop: string; order: string }
    memosTableLimit: number
    memosTableOffset: number
    memosByOffset: Record<number, Array<Memo>>
    transactionsTableLimit: number
    transactionsTableOffset: number
    transactionsByOffset: Record<number, Array<Transaction>>
    transactionsCount: number
    memosCount: number
    pendingTransactionsByOffset: Record<number, Array<PendingTransaction>>
    pendingTransactionsCount: number
  } => ({
    selectedDay: '',
    selectedMonth: '',
    selectedYear: '',
    selectedMemoId: 0,
    selectedWeek: '',
    selectedType: 'Amount Debit',
    selectedBudgetCategory: '',
    selectedDescription: '',
    selectedStatus: 'pending',
    days: [],
    daysForSelectedWeek: [],
    weeksForSelectedMonth: [],
    weeks: [],
    months: [],
    memos: [],
    years: [],
    descriptions: [],
    OFSummaries: [],
    MJSummaries: [],
    daysSummaries: [],
    weeksSummaries: [],
    monthsSummaries: [],
    transactionsCurrentPage: 1,
    transactionsPageSize: 100,
    filter: {},
    sort: { prop: '', order: '' },
    memosTableLimit: 100,
    memosTableOffset: 0,
    memosByOffset: {},
    transactionsTableLimit: 100,
    transactionsTableOffset: 0,
    transactions: [],
    transactionsByOffset: {},
    transactionsCount: 0,
    memosCount: 0,
    pendingTransactionsByOffset: {},
    pendingTransactionsCount: 0,
  }),
  getters: {
    getSelectedDay: (state) => state.selectedDay,
    getSelectedMonth: (state) => state.selectedMonth,
    getSelectedMemo: (state) => state.selectedMemoId,
    getSelectedWeek: (state) => state.selectedWeek,
    getSelectedYear: (state) => state.selectedYear,
    getSelectedType: (state) => state.selectedType,
    getSelectedDescription: (state) => state.selectedDescription,
    getSelectedStatus: (state) => state.selectedStatus,
    getDays: (state) => state.days,
    getWeeks: (state) => state.weeks,
    getMonths: (state) => state.months,
    getYears: (state) => state.years,
    getDescriptions: (state) => state.descriptions,
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
    getMemosTableLimit: (state) => state.memosTableLimit,
    getMemosTableOffset: (state) => state.memosTableOffset,
    getMemosByOffset: (state) => (offset: number) => {
      return state.memosByOffset[offset] || []
    },
    getSelectedBudgetCategory: (state) => state.selectedBudgetCategory,
    getTransactionsTableLimit: (state) => state.transactionsTableLimit,
    getTransactionsTableOffset: (state) => state.transactionsTableOffset,
    getDaysForSelectedWeek: (state) => state.daysForSelectedWeek,
    getTransactions: (state) => state.transactions,
    getTransactionsByOffset: (state) => (offset: number) => {
      return state.transactionsByOffset[offset] || []
    },
    getAllTransactions: (state) => {
      return Object.values(state.transactionsByOffset).flat()
    },
    getTransactionsCount: (state) => state.transactionsCount,
    getMemosCount: (state) => state.memosCount,
    getPendingTransactionsByOffset: (state) => (offset: number) => {
      return state.pendingTransactionsByOffset[offset] || []
    },
    getAllPendingTransactions: (state) => {
      return Object.values(state.pendingTransactionsByOffset).flat()
    },
    getPendingTransactionsCount: (state) => state.pendingTransactionsCount,
  },
  actions: {
    setSelectedDay(selectedDay: string) {
      this.selectedDay = selectedDay
    },
    setSelectedMonth(selectedMonth: string) {
      this.selectedMonth = selectedMonth
    },
    setSelectedMemo(selectedMemo: string) {
      this.selectedMemoId = Number(selectedMemo)
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
    setSelectedDescription(selectedDescription: string) {
      this.selectedDescription = selectedDescription
    },
    setSelectedStatus(selectedStatus: 'pending' | 'reviewed') {
      this.selectedStatus = selectedStatus
    },
    setDays(days: Array<DayYear>) {
      this.days = days
    },
    setMemos(memos: Array<Memo>) {
      this.memos = memos
    },
    setMemosTableLimit(limit: number) {
      this.memosTableLimit = limit
    },
    setMemosTableOffset(offset: number) {
      this.memosTableOffset = offset
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
    setDescriptions(descriptions: Array<string>) {
      this.descriptions = descriptions
    },
    setOFSummaries(summaries: Array<SummaryTypeBase>) {
      this.OFSummaries = summaries
    },
    setMJSummaries(summaries: Array<SummaryTypeBase>) {
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
      this.transactionsCurrentPage = currentPage
    },
    updateTransactionsPageSize(pageSize: number) {
      this.transactionsPageSize = pageSize
    },
    updateFilter(filter: Record<string, string>) {
      this.filter = filter
    },
    updateSort(sort: { prop: string; order: string }) {
      this.sort = sort
    },
    setSelectedBudgetCategory(selectedBudgetCategory: string | null) {
      this.selectedBudgetCategory = selectedBudgetCategory
    },
    setTransactionsTableLimit(limit: number) {
      this.transactionsTableLimit = limit
    },
    updateTransactionsTableOffset(offset: number) {
      this.transactionsTableOffset = offset
    },
    setDaysForSelectedWeek(days: Array<string>) {
      this.daysForSelectedWeek = days
    },
    setWeeksForSelectedMonth(weeks: Array<string>) {
      this.weeksForSelectedMonth = weeks
    },
    setTransactions(transactions: Array<Transaction>) {
      this.transactions = transactions
    },
    setTransactionsByOffset(offset: number, transactions: Array<Transaction>) {
      this.transactionsByOffset[offset] = transactions
    },
    clearTransactionsByOffset() {
      this.transactionsByOffset = {}
    },
    setTransactionsCount(count: number) {
      this.transactionsCount = count
    },
    setMemosByOffset(offset: number, memos: Array<Memo>) {
      this.memosByOffset[offset] = memos
    },
    setMemosCount(count: number) {
      this.memosCount = count
    },
    setPendingTransactionsByOffset(offset: number, transactions: Array<PendingTransaction>) {
      this.pendingTransactionsByOffset[offset] = transactions
    },
    clearPendingTransactionsByOffset() {
      this.pendingTransactionsByOffset = {}
    },
    setPendingTransactionsCount(count: number) {
      this.pendingTransactionsCount = count
    },
  },
})
