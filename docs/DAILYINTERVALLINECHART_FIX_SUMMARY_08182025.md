# DailyIntervalLineChart Test Loading Fix - Complete Documentation

## Overview
This document provides a comprehensive summary of the critical fixes implemented to resolve DailyIntervalLineChart loading issues in Playwright tests. These fixes ensure the component loads properly with mock data and can be reliably tested.

## Root Cause Analysis
The DailyIntervalLineChart was failing to load in Playwright tests due to several interconnected issues:

### 1. API Hook Enabled Condition Failure
- **Problem**: The `useDailyTotalAmountDebit` hook requires a valid `startDate` to be enabled
- **Cause**: The `selectedValue` computed property was returning `null` or empty string
- **Impact**: No API calls were made, resulting in no chart data

### 2. API Route Mocking Conflicts
- **Problem**: Daily totals requests (`dailyTotals=true`) weren't being intercepted properly
- **Cause**: Route handlers weren't prioritizing daily intervals requests correctly
- **Impact**: Mock data wasn't being returned for chart rendering

### 3. Test Selector Mismatches
- **Problem**: Test selectors couldn't find chart elements
- **Cause**: `data-testid` attributes weren't being passed through component hierarchy correctly
- **Impact**: Tests failed when trying to interact with chart elements

### 4. Store State Initialization Issues
- **Problem**: Clean store state wasn't being properly initialized
- **Cause**: Previous test state interference and lack of proper initial date setup
- **Impact**: Component visibility logic and API calls were affected

## Critical Fixes Implemented

### 1. Component Logic Fixes (`DailyIntervalLineChart.vue`)

#### selectedValue Computed Property
```typescript
const selectedValue = computed((): string | null => {
  // ... existing logic for week/month/day selections ...
  
  // CRITICAL FIX: Always return a valid date
  return props.firstDay || new Date().toISOString().split('T')[0]
})
```
**Why Critical**: Ensures the API hook is always enabled, preventing disabled state that blocks data loading.

#### Data-TestId Propagation
```vue
<LineChart
  :data-testid="`${props.dataTestId}-line-chart`"
  <!-- other props -->
/>
```
**Why Critical**: Creates the nested test selector structure that test helpers depend on.

### 2. API Route Mocking Fixes (`mockCommonRoutes.ts`)

#### Priority-Based Route Handling
```typescript
// PRIORITY 1: Handle daily totals requests FIRST
if (isDailyTotals) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(staticDailyIntervals)
  })
  return
}
```
**Why Critical**: Daily totals requests must be handled before any other transaction patterns to ensure chart data is properly mocked.

### 3. Test Setup Fixes (`setupTestMocks.ts`)

#### Store State Initialization
```typescript
await page.addInitScript(() => {
  window.localStorage.removeItem('transactions-store')
  window.sessionStorage.clear()
  
  const initialDate = new Date().toISOString().split('T')[0]
  window.localStorage.setItem('transactions-store', JSON.stringify({
    selectedDay: '',
    selectedWeek: '',
    selectedMonth: '',
    selectedYear: '',
    firstDay: initialDate
  }))
})
```
**Why Critical**: Provides the initial date needed for the API hook's enabled condition and ensures clean test state.

### 4. Wait Helper Fixes (`waitHelpers.ts`)

#### Correct SVG Selector
```typescript
const svg = chartContainer.locator('svg[data-testid="daily-interval-line-chart-line-chart"]')
```
**Why Critical**: Matches the exact nested data-testid structure created by the component hierarchy.

## Files Modified with Critical Documentation

1. **`DailyIntervalLineChart.vue`** - Component logic and visibility rules
2. **`mockCommonRoutes.ts`** - API route mocking priority and handling
3. **`setupTestMocks.ts`** - Store initialization and test setup
4. **`waitHelpers.ts`** - Chart loading synchronization and selectors

## Prevention Guidelines

### ⚠️ DO NOT MODIFY without considering these dependencies:

1. **selectedValue computed property** - Must always return a valid date string
2. **Route handling order** - Daily totals requests must be handled first
3. **Data-testid propagation** - Must maintain nested selector structure
4. **Store initialization** - Must provide valid initial date for API hooks

### ✅ Safe Modification Practices:

1. **Update component logic** - Ensure selectedValue fallback remains intact
2. **Add new route handlers** - Place them after daily totals priority check
3. **Modify test selectors** - Update both component and test helper simultaneously
4. **Change store structure** - Ensure firstDay property is maintained

## Testing Verification

The fixes enable these test scenarios:
- ✅ Chart loads with mock data
- ✅ Chart dots are interactive (hover/click)
- ✅ Tooltips display properly
- ✅ Chart hides when drilling down to specific dates
- ✅ Store state changes affect chart visibility correctly

## Debugging Tips

If the chart fails to load again:

1. **Check API calls**: Verify `dailyTotals=true` requests are being made
2. **Verify selectors**: Ensure `data-testid="daily-interval-line-chart-line-chart"` exists
3. **Check store state**: Confirm `selectedValue` is returning a valid date
4. **Review route mocking**: Ensure daily totals requests have highest priority

## Related Files

- **Component**: `src/components/transactions/DailyIntervalLineChart.vue`
- **API Hook**: `src/api/hooks/transactions/useDailyTotalAmountDebit.ts`
- **Test Setup**: `src/test/e2e/helpers/setupTestMocks.ts`
- **Route Mocking**: `src/test/e2e/helpers/mockCommonRoutes.ts`
- **Wait Helpers**: `src/test/e2e/helpers/waitHelpers.ts`
- **Test File**: `src/test/e2e/TransactionsTable.test.ts`

---

**Last Updated**: August 18, 2025  
**Status**: ✅ Fixed and Documented  
**Tested**: Playwright E2E tests passing
