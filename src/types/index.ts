import type { Component } from 'vue'

export interface AddressFields {
  streetAddress: string;
  unitOrAptNum?: string;
  municipality: string;
  state: string;
  zipcode?: string;
}

export type Transaction = {
  id: number;
  transaction_number: string;
  date: string;
  description: string;
  memo: string;
  memo_id: number;
  amount_debit: string;
  amount_credit: string;
  balance: string;
  check_number: string;
  fees: string;
  budget_category: string;
};

export interface MemoSummary {
  sum_amount_debit: number;
  transactions_count: number;
}

export interface WeekSummary {
  memo: string;
  weekly_amount_debit: number;
}

export interface MonthSummary {
  memo: string;
  monthly_amount_debit: number;
}

export interface DaySummary {
  memo: string;
  daily_amount_debit: number;
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

export interface PieChartData {
  label: string;
  value: number;
}

export interface Memo {
  id: number;
  name: string
  recurring: boolean;
  necessary: boolean;
  frequency?: Frequency;
  budgetCategory?: BudgetCategory['budget_category'];
}

export interface DayYear {
  day: string;
}

export interface MonthYear {
  month_year: string;
}

export interface WeekYear {
  week_year: string;
}

export interface Year {
  year: string;
}

export type TimeframeType = 'day' | 'week' | 'month' | 'year';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export enum Timeframe {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year',
}

export interface MemoFormFields {
  component: 'el-input' | 'el-switch' | 'el-select';
  label: string;
  placeholder?: string;
  disabledCondition?: boolean;
  options?: { value: string; label: string }[];
}

export type MemoKeys = 'name' | 'recurring' | 'necessary' | 'frequency';

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
  component: 'el-input' | 'el-date-picker' | 'el-select' | 'budget-category-tree-select' | 'BudgetCategoryTreeSelect' | Component;
  label: string;
  placeholder?: string;
  props?: Record<string, unknown>;
  disabledCondition?: boolean;
}

export type OFSummaryTypeBase = {
  total_debit: number;
  total_amount_debit?: number;
  year: string;
  day_number?: string;
  week_number?: string;
  month_number?: string;
  json?: JsonObjectType;
  date?: string;
}

export type JsonObjectType = {
  total_debit: number;
  month_number: string;
  year: string;
};

export type OFSummary = OFSummaryTypeBase;

export type MJSummary = OFSummaryTypeBase;

export type Summary = OFSummary | MJSummary;

export type Summaries = {
  period: string;
  total_debit: number;
  total_credit: number;
  amount_difference: number;
};

export type CategoryTreeNode = {
  value: string | number;
  label: string;
  children?: CategoryTreeNode[];
}

export type RouterQueryParams = {
  [key: string]: string | number | null | undefined;
};

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

export interface BudgetCategory {
  budget_category: string;
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


export type LoanFormType = {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  startDate: Date;
  [key: string]: number | Date;
};

export interface CarBudget {
  memo: string;
  amountDebit: number;
  total_amount_debit: number;
}

export type Breadcrumb = {
  label: string;
  to: string;
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

export type loginFormKeys = 'username' | 'password'

export interface LoginFormFields {
  component: 'el-input'
  label: string
  placeholder: string
  type: string
  showPassword?: boolean
}

export type RegisterFormKeys = 'username' | 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'

export interface RegisterFormFields {
  component: 'el-input',
  label: string,
  placeholder: string,
  type: string,
  showPassword?: boolean,
  labelPosition?: string
}

export interface MemoQueryParams {
  memoName?: string;
  date?: string;
  timeFrame?: Timeframe;
  limit?: number;
  offset?: number;
}

export interface LineChartDataPoint {
  date: Date;
  total_debit: number;
}

export interface ToolTipTransactionTableProps {
  transactions: Partial<Transaction>[];
  month: string;
  amount: number;
}