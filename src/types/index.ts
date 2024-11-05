export interface AddressFields {
    streetAddress: string;
    unitOrAptNum?: string;
    municipality: string;
    state: string;
    zipcode?: string;
}

export type Transaction = {
    transactionNumber: string;
    date: string;
    description?: string;
    memo: string;
    amountDebit: string;
    amountCredit?: string;
    balance?: string;
    checkNumber?: string;
    fees?: string;
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

export interface MemoSumAmountDebits {
    memo: string;
    total_debit: number;
}

export interface DaySummary {
    memo: string;
    daily_amount_debit: number;
}


export interface AddressResponse {
    osm_type: string;
    osm_id: number;
    licence: string;
    boundingbox: string[];
    address: {
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
        "ISO3166-2-lvl4": string;
    };
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
    name: string
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

export enum Timeframe {
    Day = 'day',
    Month = 'month',
    Week = 'week',
    Year = 'year',
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
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

export interface FormField {
    label: string;
    type: string;
    placeholder: string;
}

export interface BudgetCategory {
    budget_category: string;
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

export interface DailyInterval {
    day_number?: number;
    week_number?: number;
    month_number?: number;
    year?: number;
    date: Date,
    total_amount_debit: number;
    total_debit?: number;
}
