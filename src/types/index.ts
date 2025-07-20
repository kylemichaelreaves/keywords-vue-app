import type { Component } from 'vue'

export interface AddressFields {
  streetAddress: string;
  unitOrAptNum?: string;
  municipality: string;
  state: string;
  zipcode?: string;
}

export interface Address {
  house_number: string;
  road: string;
  town?: string;
  village?: string;
  neighbourhood?: string;
  county: string;
  state: string
  postcode: string;
  country: string;
  country_code: string;
  'ISO3166-2-lvl4': string;
}

export interface AddressResponse {
  osm_type: string;
  osm_id: number;
  licence: string;
  boundingbox: string[];
  address: Address;
  importance: number;
  lon: string;
  display_name: string;
  type: string;
  class: string;
  place_id: number;
  lat: string
}

export type Breadcrumb = {
  label: string;
  to: string;
}

export interface BudgetCategory {
  name: string;
  necessary: boolean;
  recurring: boolean;
  frequency?: Frequency;
}

export interface BudgetCategoryData {
  id: string;
  name: string;
  subcategories?: Record<string, BudgetCategoryData>;
}

export interface BudgetCategoryResponse {
  data: BudgetCategoryData;
}


export interface CarBudget {
  memo: string;
  amountDebit: number;
  total_amount_debit: number;
}

export interface CategoryNode {
  id: number;
  value: string;
  label: string;
  parent_id: number | null;
  children?: CategoryNode[];
}

export interface DailyInterval {
  day_number?: number;
  week_number?: number;
  month_number?: number;
  year?: number;
  date: Date,
  total_amount_debit: number;
  total_debit?: number;
}


export interface DaySummary {
  memo: string;
  daily_amount_debit: number;
}

export interface DayYear {
  day: string;
}

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type JsonObjectType = {
  total_debit: number;
  month_number: string;
  year: string;
};

export interface LineChartDataPoint {
  date: Date;
  total_debit: number;
}


export type LoanFormType = {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  startDate: Date;
  [key: string]: number | Date;
};


export type loginFormKeys = 'username' | 'password'

export interface LoginFormFields {
  component: 'el-input'
  label: string
  placeholder: string
  type: string
  showPassword?: boolean
}

export interface Memo {
  id: number;
  name: string
  recurring: boolean;
  necessary: boolean;
  frequency: Frequency;
  budget_category: BudgetCategory['name'];
  ambiguous: boolean;
  total_amount_debit?: number;
  transactions_count?: number;
  avatar_s3_url?: string;
}


export interface MemoSummary {
  sum_amount_debit: number;
  transactions_count: number;
}

export interface MemoQueryParams {
  memoName?: string;
  date?: string;
  timeFrame?: Timeframe;
  limit?: number;
  offset?: number;
  count?: boolean;
}

export interface MemoFormFields {
  component: 'el-input' | 'el-switch' | 'el-select' | Component;
  label: string;
  placeholder?: string;
  disabledCondition?: boolean;
  options?: { value: string; label: string }[];
}

export type MemoKeys =
  'name'
  | 'recurring'
  | 'necessary'
  | 'frequency'
  | 'budget_category'
  | 'ambiguous'
  | 'avatar_s3_url';


export interface MonthSummary {
  memo: string;
  monthly_amount_debit: number;
}

export interface MonthYear {
  month_year: string;
}


export interface PieChartData {
  label: string;
  value: number;
}


export type RouterQueryParams = {
  [key: string]: string | number | null | undefined;
};


export type RegisterFormKeys = 'username' | 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'

export interface RegisterFormFields {
  component: 'el-input',
  label: string,
  placeholder: string,
  type: string,
  showPassword?: boolean,
  labelPosition?: string
}


export type SummaryTypeBase = {
  total_debit: number;
  total_amount_debit?: number;
  year: string;
  day_number?: string;
  week_number?: string;
  month_number?: string;
  json?: JsonObjectType;
  date?: string;
}


export type Summaries = {
  period: string;
  total_debit: number;
  total_credit: number;
  amount_difference: number;
};


export type TimeframeType = 'day' | 'week' | 'month' | 'year';


export enum Timeframe {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year',
}

export type Transaction = {
  id?: number;
  transaction_number?: string;
  date: string;
  description: string;
  memo: string;
  memo_id?: number;
  amount_debit: string;
  amount_credit: string;
  balance?: string;
  check_number?: string;
  fees?: string;
  budget_category?: string;
};


export type TransactionKeys =
  'transaction_number'
  | 'date'
  | 'description'
  | 'memo'
  | 'amount_debit'
  | 'amount_credit'
  | 'balance'
  | 'check_number'
  | 'fees'
  | 'budget_category';

export type TransactionFormFields = {
  component: 'el-input' | 'el-date-picker' | 'el-select' | Component;
  label: string;
  placeholder?: string;
  props?: Record<string, unknown>;
  disabledCondition?: boolean;
}


export interface TransactionQueryParams {
  date?: string | Date;
  offset?: number;
  limit?: number;
  memo?: Memo['name'];
  timeFrame?: TimeframeType;
  oldestDate?: boolean;
  count?: boolean;
  budgetCategory?: BudgetCategory['name'];
  historical?: boolean;
  totalAmountDebit?: boolean;
  budgetCategorySummary?: boolean;
  budgetCategoryHierarchySum?: boolean;
}


export interface ToolTipTransactionTableProps {
  transactions: Partial<Transaction>[];
  month: string;
  amount: number;
}

export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role?: UserRole;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface WeekSummary {
  memo: string;
  weekly_amount_debit: number;
}

export interface WeekYear {
  week_year: string;
}

export interface Year {
  year: string;
}

export interface BudgetCategoryHierarchySummaryResponse {
  category_id: number;
  category_name: string;
  full_path: string;
  level: number;
  parent_id: number | null;
  source_id: number;
  total_amount_debit: number;
}