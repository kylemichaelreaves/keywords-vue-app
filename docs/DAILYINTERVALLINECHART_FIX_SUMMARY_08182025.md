# DailyIntervalLineChart Test Loading Fix - Complete Documentation

## Overview

This document provides a comprehensive summary of the critical fixes implemented to resolve DailyIntervalLineChart
loading issues in Playwright tests, as well as the critical route mocking fix that resolved TransactionsTable.test.ts
returning JSON instead of rendering the UI. These fixes ensure components load properly with mock data and can be reliably
tested.

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

### 1. Route Mocking Pattern Fix (CRITICAL - August 19, 2025)

#### Problem: Tests Receiving JSON Instead of UI
- **Issue**: TransactionsTable.test.ts was receiving JSON data instead of rendering the UI
- **Root Cause**: Overly broad route mocking patterns were intercepting page navigation
- **Pattern**: `**/transactions**` was catching both API requests AND page routes like `budget-visualizer/transactions`
- **Impact**: Browser received JSON response when navigating to the transactions page instead of HTML UI

#### Solution: API-Specific Route Patterns

**Before (Problematic):**
```typescript
await page.route(`**/transactions**`, async (route: any) => {
  // This catches EVERYTHING including page navigation
})
```

**After (Fixed):**
```typescript
await page.route(`**/api/**/transactions**`, async (route: any) => {
  // This only catches actual API endpoints
})
```

#### Files Fixed:
1. **`mockCommonRoutes.ts`**:
   - Changed `**/transactions**` → `**/api/**/transactions**`
   - Updated all basic transaction route patterns
   - Fixed daily interval and budget category patterns

2. **`mockTransactionsTableSelects.ts`**:
   - Changed `**/transactions/days` → `**/api/**/transactions/days`
   - Fixed all select dropdown API patterns
   - Updated memos patterns

3. **`memoRouteHelper.ts`**:
   - Fixed budget category hierarchy patterns
   - Updated route clearing patterns

#### Why This Fix is Critical:
- **Page Navigation Protection**: Prevents route mocks from intercepting actual page loads
- **API-Only Targeting**: Ensures mocks only affect API calls, not UI navigation
- **Test Reliability**: Eliminates the JSON-instead-of-UI bug that was breaking tests
- **Future-Proof**: More specific patterns prevent similar issues with new routes

### 2. CI Environment Fixes (CRITICAL - August 19, 2025)

#### Problem: Tests Passing Locally but Failing in CI
- **Issue**: Tests work perfectly in local development but consistently fail in GitHub Actions CI
- **Root Cause**: CI environment has different constraints (limited resources, stricter CORS, timing issues)
- **Impact**: Unreliable CI pipeline despite working local tests

#### Solution: CI-Specific Optimizations

**CORS Headers for CI:**
```typescript
const ciHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```

**CI-Specific Timeouts:**
```typescript
// Chart visibility: Increased from 60s to 90s in CI
await expect(transactionsPage.intervalLineChart).toBeVisible({
  timeout: isCI ? 90000 : 30000
})

// Route setup delays for CI
if (isCI) {
  await page.waitForTimeout(1500)
}
```

**Enhanced CI Logging:**
```typescript
if (isCI) {
  console.log('[CI SETUP] Starting comprehensive mock setup...')
  console.log('[CI WAIT] Table content wait complete')
}
```

#### Why This Fix is Critical:
- **CI Reliability**: Ensures tests pass consistently in CI environment
- **Resource Management**: Accounts for CI's limited CPU/memory resources
- **CORS Compliance**: Handles stricter CI browser security requirements
- **Debugging Capability**: Provides visibility into CI-specific issues

### 3. Component Logic Fixes (`DailyIntervalLineChart.vue`)

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

### 4. API Route Mocking Fixes (`mockCommonRoutes.ts`)

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

// PRIORITY 2: Handle table data requests (limit/offset patterns for pagination)
if (hasLimit && hasOffset) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(staticTransactions)
  })
  return
}

// PRIORITY 3: Handle specific date/timeframe requests
// PRIORITY 4: Handle other transaction requests
```

**Why Critical**: The priority order ensures that:

1. Daily totals requests are handled first for chart data
2. Table pagination requests are handled second for table data
3. Other requests are handled with appropriate fallbacks

### 5. Test Setup Fixes (`setupTestMocks.ts`)

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

### 6. Wait Helper Fixes (`waitHelpers.ts`)

#### Correct SVG Selector

```typescript
const svg = chartContainer.locator('svg[data-testid="daily-interval-line-chart-line-chart"]')
```

**Why Critical**: Matches the exact nested data-testid structure created by the component hierarchy.

## Files Modified with Critical Documentation

1. **`mockCommonRoutes.ts`** - **CRITICAL FIX**: Changed overly broad route patterns to API-specific patterns
2. **`mockTransactionsTableSelects.ts`** - **CRITICAL FIX**: Updated all route patterns to prevent page navigation interception
3. **`memoRouteHelper.ts`** - **CRITICAL FIX**: Fixed budget category route patterns
4. **`DailyIntervalLineChart.vue`** - Component logic and visibility rules
5. **`setupTestMocks.ts`** - Store initialization and test setup
6. **`waitHelpers.ts`** - Chart loading synchronization and selectors

## Prevention Guidelines

### ⚠️ CRITICAL: Route Pattern Best Practices

**Never Use These Patterns (Too Broad):**
```typescript
// DON'T - Catches page navigation
page.route('**/transactions**')
page.route('**/memos**')  
page.route('**/budget-categories**')
```

**Always Use These Patterns (API-Specific):**
```typescript
// DO - Only catches API calls
page.route('**/api/**/transactions**')
page.route('**/api/**/memos**')
page.route('**/api/**/budget-categories**')
```

### ⚠️ DO NOT MODIFY without considering these dependencies:

1. **Route pattern specificity** - Must include `/api/` to avoid intercepting page navigation
2. **selectedValue computed property** - Must always return a valid date string
3. **Route handling order** - Daily totals requests must be handled first
4. **Data-testid propagation** - Must maintain nested selector structure
5. **Store initialization** - Must provide valid initial date for API hooks

### ✅ Safe Modification Practices:

1. **Update component logic** - Ensure selectedValue fallback remains intact
2. **Add new route handlers** - Place them after daily totals priority check
3. **Modify test selectors** - Update both component and test helper simultaneously
4. **Change store structure** - Ensure firstDay property is maintained

## Testing Verification

The fixes enable these test scenarios:

- ✅ **Page Navigation**: Tests navigate to actual UI pages instead of receiving JSON
- ✅ **API Mocking**: API calls are properly intercepted and mocked
- ✅ Chart loads with mock data
- ✅ Chart dots are interactive (hover/click)
- ✅ Tooltips display properly
- ✅ Chart hides when drilling down to specific dates
- ✅ Store state changes affect chart visibility correctly
- ✅ **UI Rendering**: TransactionsTable.test.ts renders the full UI correctly

## Debugging Tips

If tests start receiving JSON instead of UI again:

1. **Check route patterns**: Ensure all patterns include `/api/` to target only API endpoints
2. **Verify page navigation**: Test that `page.goto('budget-visualizer/transactions')` loads HTML, not JSON
3. **Review new route additions**: Any new route mocks must follow API-specific patterns
4. **Check console logs**: Look for route interception logs to identify problematic patterns

If the chart fails to load again:

1. **Check API calls**: Verify `dailyTotals=true` requests are being made
2. **Verify selectors**: Ensure `data-testid="daily-interval-line-chart-line-chart"` exists
3. **Check store state**: Confirm `selectedValue` is returning a valid date
4. **Review route mocking**: Ensure daily totals requests have highest priority

## Related Files

- **CRITICAL**: `src/test/e2e/helpers/mockCommonRoutes.ts` - Main route mocking patterns
- **CRITICAL**: `src/test/e2e/helpers/mockTransactionsTableSelects.ts` - Select dropdown API mocking
- **CRITICAL**: `src/test/e2e/helpers/memoRouteHelper.ts` - Memo-related route patterns
- **Component**: `src/components/transactions/DailyIntervalLineChart.vue`
- **API Hook**: `src/api/hooks/transactions/useDailyTotalAmountDebit.ts`
- **Test Setup**: `src/test/e2e/helpers/setupTestMocks.ts`
- **Wait Helpers**: `src/test/e2e/helpers/waitHelpers.ts`
- **Test File**: `src/test/e2e/TransactionsTable.test.ts`




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

// PRIORITY 2: Handle table data requests (limit/offset patterns for pagination)
if (hasLimit && hasOffset) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(staticTransactions)
  })
  return
}

// PRIORITY 3: Handle specific date/timeframe requests
// PRIORITY 4: Handle other transaction requests
```

**Why Critical**: The priority order ensures that:

1. Daily totals requests are handled first for chart data
2. Table pagination requests are handled second for table data
3. Other requests are handled with appropriate fallbacks



---

**Last Updated**: August 18, 2025  
**Status**: ✅ Fixed and Documented  
**Tested**: Playwright E2E tests passing