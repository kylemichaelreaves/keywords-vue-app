// composables/useURLSync.ts
import { nextTick, onMounted, watch } from 'vue'
import type { LocationQuery } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue.ts'
import { useTransactionsStore } from '@stores/transactions.ts'


export default function useURLSync() {
  const route = useRoute()
  const router = useRouter()
  const store = useTransactionsStore()

  // Simplified: Only handle query parameters (route guards handle params)
  const updateStoreFromQuery = () => {
    // Only process queries on transactions page
    if (route.name !== 'transactions') return

    const { timeFrame, date } = route.query

    // Clear existing selections first (since we're on transactions page)
    store.setSelectedDay('')
    store.setSelectedWeek('')
    store.setSelectedMonth('')
    store.setSelectedYear('')

    if (timeFrame && date) {
      const dateStr = Array.isArray(date) ? date[0] : date

      switch (timeFrame) {
        case 'day':
          store.setSelectedDay(dateStr as string)
          break
        case 'week':
          store.setSelectedWeek(dateStr as string)
          break
        case 'month':
          store.setSelectedMonth(dateStr as string)
          break
        case 'year':
          store.setSelectedYear(dateStr as string)
          break
      }
    }
  }

  // Constants for routes
  const ROUTES = {
    MEMO: 'memo',
    MONTH_SUMMARY: 'month-summary',
    WEEK_SUMMARY: 'week-summary',
    TRANSACTIONS: 'transactions'
  } as const

  // Helper function to build query parameters
  const buildDateQuery = () => {
    const dateTypeAndVal = getTimeframeTypeAndValue()

    if (!dateTypeAndVal.timeFrame || !dateTypeAndVal.selectedValue) {
      return {}
    }

    return {
      timeFrame: dateTypeAndVal.timeFrame,
      date: dateTypeAndVal.selectedValue.value
    }
  }

  // Helper function to check if query needs updating
  const shouldUpdateQuery = (newQuery: Record<string, string | undefined>, currentQuery: LocationQuery): boolean => {
    const queryKeys = ['timeFrame', 'date']

    return queryKeys.some(key =>
      newQuery[key] !== currentQuery[key] ||
      (!newQuery[key] && currentQuery[key])
    )
  }

  // Store → Navigation: Determine where to navigate based on store state
  const getNavigationTarget = () => {
    const selections = {
      selectedMemo: store.getSelectedMemo,
      selectedMonth: store.getSelectedMonth,
      selectedWeek: store.getSelectedWeek,
      selectedDay: store.getSelectedDay,
      selectedYear: store.getSelectedYear
    }

    // Priority-based navigation rules
    const navigationRules = [
      {
        condition: selections.selectedMemo,
        target: { name: ROUTES.MEMO, params: { memoName: selections.selectedMemo } },
        currentRoute: ROUTES.MEMO
      },
      {
        condition: selections.selectedMonth,
        target: { name: ROUTES.MONTH_SUMMARY, params: { month: selections.selectedMonth } },
        currentRoute: ROUTES.MONTH_SUMMARY
      },
      {
        condition: selections.selectedWeek,
        target: { name: ROUTES.WEEK_SUMMARY, params: { week: selections.selectedWeek } },
        currentRoute: ROUTES.WEEK_SUMMARY
      },
      {
        condition: selections.selectedDay || selections.selectedYear,
        target: { name: ROUTES.TRANSACTIONS, query: buildDateQuery() },
        currentRoute: ROUTES.TRANSACTIONS,
        requiresSpecialHandling: true
      }
    ]

    return navigationRules.find(rule => rule.condition) || null
  }

  // Store → URL: Navigate based on store changes
  const updateURLFromStore = () => {
    const navigationTarget = getNavigationTarget()

    if (!navigationTarget) return

    const { target, currentRoute, requiresSpecialHandling } = navigationTarget

    // Handle transactions route specially (uses query params)
    if (requiresSpecialHandling && route.name === ROUTES.TRANSACTIONS) {
      const newQuery = target.query || {}

      if (shouldUpdateQuery(newQuery, route.query)) {
        router.replace({
          name: ROUTES.TRANSACTIONS,
          query: Object.keys(newQuery).length > 0 ? newQuery : undefined
        })
      }
      return
    }

    // Navigate to param-based routes (guards will handle store updates)
    if (route.name !== currentRoute) {
      router.push(target)
    }
  }

  // Utility function
  const clearSelections = () => {
    store.setSelectedDay('')
    store.setSelectedWeek('')
    store.setSelectedMonth('')
    store.setSelectedYear('')
    store.setSelectedMemo('')
  }

  // Track if we're currently updating from URL to prevent loops
  let updatingFromQuery = false

  // Watch for URL query changes (params handled by route guards)
  watch(
    () => route.query,
    () => {
      updatingFromQuery = true
      updateStoreFromQuery()
      nextTick(() => {
        updatingFromQuery = false
      })
    }
  )

  // Watch for store changes → trigger navigation
  watch(
    [
      () => store.getSelectedDay,
      () => store.getSelectedWeek,
      () => store.getSelectedMonth,
      () => store.getSelectedYear,
      () => store.getSelectedMemo
    ],
    () => {
      if (!updatingFromQuery) {
        updateURLFromStore()
      }
    },
    { immediate: false }
  )

  // Initialize query sync on mount
  onMounted(() => {
    updateStoreFromQuery()
  })

  return {
    clearSelections
  }
}