import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const selectedDay = ref('')
  const selectedMonth = ref('')
  const selectedYear = ref('')
  const selectedMemoId = ref<Memo['id']>(0)
  const selectedWeek = ref('')
  const selectedType = ref('Amount Debit')
  const selectedBudgetCategory = ref<string | null>('')
  const selectedDescription = ref('')
  const selectedStatus = ref<'pending' | 'reviewed'>('pending')
  const days = ref<Array<DayYear>>([])
  const daysForSelectedWeek = ref<Array<string>>([])
  const weeksForSelectedMonth = ref<Array<string>>([])
  const weeks = ref<Array<WeekYear>>([])
  const months = ref<Array<MonthYear>>([])
  const memos = ref<Array<Memo>>([])
  const years = ref<Array<Year>>([])
  const descriptions = ref<Array<string>>([])
  const OFSummaries = ref<Array<SummaryTypeBase>>([])
  const MJSummaries = ref<Array<SummaryTypeBase>>([])
  const daysSummaries = ref<Array<Summaries>>([])
  const weeksSummaries = ref<Array<Summaries>>([])
  const monthsSummaries = ref<Array<Summaries>>([])
  const transactionsCurrentPage = ref(1)
  const transactionsPageSize = ref(100)
  const filter = ref<Record<string, string>>({})
  const sort = ref({ prop: '', order: '' })
  const memosTableLimit = ref(100)
  const memosTableOffset = ref(0)
  const memosByOffset = ref<Record<number, Array<Memo>>>({})
  const transactionsTableLimit = ref(100)
  const transactionsTableOffset = ref(0)
  const transactions = ref<Array<Transaction>>([])
  const transactionsByOffset = ref<Record<number, Array<Transaction>>>({})
  const transactionsCount = ref(0)
  const memosCount = ref(0)
  const pendingTransactionsByOffset = ref<Record<number, Array<PendingTransaction>>>({})
  const pendingTransactionsCount = ref(0)

  // Getters
  const getSelectedDay = computed(() => selectedDay.value)
  const getSelectedMonth = computed(() => selectedMonth.value)
  const getSelectedMemo = computed(() => selectedMemoId.value)
  const getSelectedWeek = computed(() => selectedWeek.value)
  const getSelectedYear = computed(() => selectedYear.value)
  const getSelectedType = computed(() => selectedType.value)
  const getSelectedDescription = computed(() => selectedDescription.value)
  const getSelectedStatus = computed(() => selectedStatus.value)
  const getDays = computed(() => days.value)
  const getWeeks = computed(() => weeks.value)
  const getMonths = computed(() => months.value)
  const getYears = computed(() => years.value)
  const getDescriptions = computed(() => descriptions.value)
  const getMemos = computed(() => memos.value)
  const getOFSummaries = computed(() => OFSummaries.value)
  const getMJSummaries = computed(() => MJSummaries.value)
  const getDaysSummaries = computed(() => daysSummaries.value)
  const getWeeksSummaries = computed(() => weeksSummaries.value)
  const getMonthsSummaries = computed(() => monthsSummaries.value)
  const getTransactionsCurrentPage = computed(() => transactionsCurrentPage.value)
  const getTransactionsPageSize = computed(() => transactionsPageSize.value)
  const getFilter = computed(() => filter.value)
  const getSort = computed(() => sort.value)
  const getMemosTableLimit = computed(() => memosTableLimit.value)
  const getMemosTableOffset = computed(() => memosTableOffset.value)
  const getMemosByOffset = (offset: number) => memosByOffset.value[offset] || []
  const getSelectedBudgetCategory = computed(() => selectedBudgetCategory.value)
  const getTransactionsTableLimit = computed(() => transactionsTableLimit.value)
  const getTransactionsTableOffset = computed(() => transactionsTableOffset.value)
  const getDaysForSelectedWeek = computed(() => daysForSelectedWeek.value)
  const getTransactions = computed(() => transactions.value)
  const getTransactionsByOffset = (offset: number) => transactionsByOffset.value[offset] || []
  const getAllTransactions = computed(() => Object.values(transactionsByOffset.value).flat())
  const getTransactionsCount = computed(() => transactionsCount.value)
  const getMemosCount = computed(() => memosCount.value)
  const getPendingTransactionsByOffset = (offset: number) => pendingTransactionsByOffset.value[offset] || []
  const getAllPendingTransactions = computed(() => Object.values(pendingTransactionsByOffset.value).flat())
  const getPendingTransactionsCount = computed(() => pendingTransactionsCount.value)

  // Actions
  function setSelectedDay(day: string) {
    selectedDay.value = day
  }

  function setSelectedMonth(month: string) {
    selectedMonth.value = month
  }

  function setSelectedMemo(memo: string) {
    selectedMemoId.value = Number(memo)
  }

  function setSelectedWeek(week: string) {
    selectedWeek.value = week
  }

  function setSelectedYear(year: string) {
    selectedYear.value = year
  }

  function setSelectedType(type: string) {
    selectedType.value = type
  }

  function setSelectedDescription(description: string) {
    selectedDescription.value = description
  }

  function setSelectedStatus(status: 'pending' | 'reviewed') {
    selectedStatus.value = status
  }

  function setDays(daysArray: Array<DayYear>) {
    days.value = daysArray
  }

  function setMemos(memosArray: Array<Memo>) {
    memos.value = memosArray
  }

  function setMemosTableLimit(limit: number) {
    memosTableLimit.value = limit
  }

  function setMemosTableOffset(offset: number) {
    memosTableOffset.value = offset
  }

  function setMonths(monthsArray: Array<MonthYear>) {
    months.value = monthsArray
  }

  function setWeeks(weeksArray: Array<WeekYear>) {
    weeks.value = weeksArray
  }

  function setYears(yearsArray: Array<Year>) {
    years.value = yearsArray
  }

  function setDescriptions(descriptionsArray: Array<string>) {
    descriptions.value = descriptionsArray
  }

  function setOFSummaries(summaries: Array<SummaryTypeBase>) {
    OFSummaries.value = summaries
  }

  function setMJSummaries(summaries: Array<SummaryTypeBase>) {
    MJSummaries.value = summaries
  }

  function setDaysSummaries(summaries: Array<Summaries>) {
    daysSummaries.value = summaries
  }

  function setWeeksSummaries(summaries: Array<Summaries>) {
    weeksSummaries.value = summaries
  }

  function setMonthsSummaries(summaries: Array<Summaries>) {
    monthsSummaries.value = summaries
  }

  function updateTransactionsCurrentPage(currentPage: number) {
    transactionsCurrentPage.value = currentPage
  }

  function updateTransactionsPageSize(pageSize: number) {
    transactionsPageSize.value = pageSize
  }

  function updateFilter(newFilter: Record<string, string>) {
    filter.value = newFilter
  }

  function updateSort(newSort: { prop: string; order: string }) {
    sort.value = newSort
  }

  function setSelectedBudgetCategory(category: string | null) {
    selectedBudgetCategory.value = category
  }

  function setTransactionsTableLimit(limit: number) {
    transactionsTableLimit.value = limit
  }

  function updateTransactionsTableOffset(offset: number) {
    transactionsTableOffset.value = offset
  }

  function setDaysForSelectedWeek(daysArray: Array<string>) {
    daysForSelectedWeek.value = daysArray
  }

  function setWeeksForSelectedMonth(weeksArray: Array<string>) {
    weeksForSelectedMonth.value = weeksArray
  }

  function setTransactions(transactionsArray: Array<Transaction>) {
    transactions.value = transactionsArray
  }

  function setTransactionsByOffset(offset: number, transactionsArray: Array<Transaction>) {
    transactionsByOffset.value[offset] = transactionsArray
  }

  function clearTransactionsByOffset() {
    transactionsByOffset.value = {}
  }

  function setTransactionsCount(count: number) {
    transactionsCount.value = count
  }

  function setMemosByOffset(offset: number, memosArray: Array<Memo>) {
    memosByOffset.value[offset] = memosArray
  }

  function setMemosCount(count: number) {
    memosCount.value = count
  }

  function setPendingTransactionsByOffset(offset: number, transactionsArray: Array<PendingTransaction>) {
    pendingTransactionsByOffset.value[offset] = transactionsArray
  }

  function clearPendingTransactionsByOffset() {
    pendingTransactionsByOffset.value = {}
  }

  function setPendingTransactionsCount(count: number) {
    pendingTransactionsCount.value = count
  }

  return {
    // State
    selectedDay,
    selectedMonth,
    selectedYear,
    selectedMemoId,
    selectedWeek,
    selectedType,
    selectedBudgetCategory,
    selectedDescription,
    selectedStatus,
    days,
    daysForSelectedWeek,
    weeksForSelectedMonth,
    weeks,
    months,
    memos,
    years,
    descriptions,
    OFSummaries,
    MJSummaries,
    daysSummaries,
    weeksSummaries,
    monthsSummaries,
    transactionsCurrentPage,
    transactionsPageSize,
    filter,
    sort,
    memosTableLimit,
    memosTableOffset,
    memosByOffset,
    transactionsTableLimit,
    transactionsTableOffset,
    transactions,
    transactionsByOffset,
    transactionsCount,
    memosCount,
    pendingTransactionsByOffset,
    pendingTransactionsCount,
    // Getters
    getSelectedDay,
    getSelectedMonth,
    getSelectedMemo,
    getSelectedWeek,
    getSelectedYear,
    getSelectedType,
    getSelectedDescription,
    getSelectedStatus,
    getDays,
    getWeeks,
    getMonths,
    getYears,
    getDescriptions,
    getMemos,
    getOFSummaries,
    getMJSummaries,
    getDaysSummaries,
    getWeeksSummaries,
    getMonthsSummaries,
    getTransactionsCurrentPage,
    getTransactionsPageSize,
    getFilter,
    getSort,
    getMemosTableLimit,
    getMemosTableOffset,
    getMemosByOffset,
    getSelectedBudgetCategory,
    getTransactionsTableLimit,
    getTransactionsTableOffset,
    getDaysForSelectedWeek,
    getTransactions,
    getTransactionsByOffset,
    getAllTransactions,
    getTransactionsCount,
    getMemosCount,
    getPendingTransactionsByOffset,
    getAllPendingTransactions,
    getPendingTransactionsCount,
    // Actions
    setSelectedDay,
    setSelectedMonth,
    setSelectedMemo,
    setSelectedWeek,
    setSelectedYear,
    setSelectedType,
    setSelectedDescription,
    setSelectedStatus,
    setDays,
    setMemos,
    setMemosTableLimit,
    setMemosTableOffset,
    setMonths,
    setWeeks,
    setYears,
    setDescriptions,
    setOFSummaries,
    setMJSummaries,
    setDaysSummaries,
    setWeeksSummaries,
    setMonthsSummaries,
    updateTransactionsCurrentPage,
    updateTransactionsPageSize,
    updateFilter,
    updateSort,
    setSelectedBudgetCategory,
    setTransactionsTableLimit,
    updateTransactionsTableOffset,
    setDaysForSelectedWeek,
    setWeeksForSelectedMonth,
    setTransactions,
    setTransactionsByOffset,
    clearTransactionsByOffset,
    setTransactionsCount,
    setMemosByOffset,
    setMemosCount,
    setPendingTransactionsByOffset,
    clearPendingTransactionsByOffset,
    setPendingTransactionsCount,
  }
})

