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
} from '@types'

const DEFAULTS = {
  selectedDay: '',
  selectedMonth: '',
  selectedYear: '',
  selectedMemo: '',
  selectedWeek: '',
  selectedType: 'Amount Debit',
  selectedBudgetCategory: '' as string | null,
  selectedDescription: '',
  selectedStatus: 'pending' as 'pending' | 'reviewed',
  transactionsCurrentPage: 1,
  transactionsPageSize: 100,
  memosTableLimit: 100,
  memosTableOffset: 0,
  transactionsTableLimit: 100,
  transactionsTableOffset: 0,
  transactionsCount: 0,
  memosCount: 0,
  pendingTransactionsCount: 0,
}

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const selectedDay = ref(DEFAULTS.selectedDay)
  const selectedMonth = ref(DEFAULTS.selectedMonth)
  const selectedYear = ref(DEFAULTS.selectedYear)
  const selectedMemo = ref<string>(DEFAULTS.selectedMemo)
  const selectedWeek = ref(DEFAULTS.selectedWeek)
  const selectedType = ref(DEFAULTS.selectedType)
  const selectedBudgetCategory = ref<string | null>(DEFAULTS.selectedBudgetCategory)
  const selectedDescription = ref(DEFAULTS.selectedDescription)
  const selectedStatus = ref<'pending' | 'reviewed'>(DEFAULTS.selectedStatus)
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
  const transactionsCurrentPage = ref(DEFAULTS.transactionsCurrentPage)
  const transactionsPageSize = ref(DEFAULTS.transactionsPageSize)
  const filter = ref<Record<string, string>>({})
  const sort = ref({ prop: '', order: '' })
  const memosTableLimit = ref(DEFAULTS.memosTableLimit)
  const memosTableOffset = ref(DEFAULTS.memosTableOffset)
  const memosByOffset = ref<Record<number, Array<Memo>>>({})
  const transactionsTableLimit = ref(DEFAULTS.transactionsTableLimit)
  const transactionsTableOffset = ref(DEFAULTS.transactionsTableOffset)
  const transactions = ref<Array<Transaction>>([])
  const transactionsCount = ref(DEFAULTS.transactionsCount)
  const memosCount = ref(DEFAULTS.memosCount)
  const pendingTransactionsCount = ref(DEFAULTS.pendingTransactionsCount)

  // Getters
  const getSelectedDay = computed(() => selectedDay.value)
  const getSelectedMonth = computed(() => selectedMonth.value)
  const getSelectedMemo = computed(() => selectedMemo.value)
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
  const getTransactionsCount = computed(() => transactionsCount.value)
  const getMemosCount = computed(() => memosCount.value)
  const getPendingTransactionsCount = computed(() => pendingTransactionsCount.value)

  // Actions
  function setSelectedDay(day: string) {
    selectedDay.value = day
  }

  function setSelectedMonth(month: string) {
    selectedMonth.value = month
  }

  function setSelectedMemo(memo: string) {
    selectedMemo.value = memo
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

  function setTransactionsCount(count: number) {
    transactionsCount.value = count
  }

  function setMemosByOffset(offset: number, memosArray: Array<Memo>) {
    memosByOffset.value[offset] = memosArray
  }

  function setMemosCount(count: number) {
    memosCount.value = count
  }

  function setPendingTransactionsCount(count: number) {
    pendingTransactionsCount.value = count
  }

  function resetStore() {
    selectedDay.value = DEFAULTS.selectedDay
    selectedMonth.value = DEFAULTS.selectedMonth
    selectedYear.value = DEFAULTS.selectedYear
    selectedMemo.value = DEFAULTS.selectedMemo
    selectedWeek.value = DEFAULTS.selectedWeek
    selectedType.value = DEFAULTS.selectedType
    selectedBudgetCategory.value = DEFAULTS.selectedBudgetCategory
    selectedDescription.value = DEFAULTS.selectedDescription
    selectedStatus.value = DEFAULTS.selectedStatus
    days.value = []
    daysForSelectedWeek.value = []
    weeksForSelectedMonth.value = []
    weeks.value = []
    months.value = []
    memos.value = []
    years.value = []
    descriptions.value = []
    OFSummaries.value = []
    MJSummaries.value = []
    daysSummaries.value = []
    weeksSummaries.value = []
    monthsSummaries.value = []
    transactionsCurrentPage.value = DEFAULTS.transactionsCurrentPage
    transactionsPageSize.value = DEFAULTS.transactionsPageSize
    filter.value = {}
    sort.value = { prop: '', order: '' }
    memosTableLimit.value = DEFAULTS.memosTableLimit
    memosTableOffset.value = DEFAULTS.memosTableOffset
    memosByOffset.value = {}
    transactionsTableLimit.value = DEFAULTS.transactionsTableLimit
    transactionsTableOffset.value = DEFAULTS.transactionsTableOffset
    transactions.value = []
    transactionsCount.value = DEFAULTS.transactionsCount
    memosCount.value = DEFAULTS.memosCount
    pendingTransactionsCount.value = DEFAULTS.pendingTransactionsCount
  }

  return {
    // State
    selectedDay,
    selectedMonth,
    selectedYear,
    selectedMemo,
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
    transactionsCount,
    memosCount,
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
    getTransactionsCount,
    getMemosCount,
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
    setTransactionsCount,
    setMemosByOffset,
    setMemosCount,
    setPendingTransactionsCount,
    resetStore,
  }
})
