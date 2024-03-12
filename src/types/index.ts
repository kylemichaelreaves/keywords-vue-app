import * as d3 from "d3";

interface AddressFields {
    streetAddress: string;
    unitOrAptNum?: string;
    municipality: string;
    state: string;
    zipcode?: string;
}

type Transaction = {
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

interface TransactionData {
    [key: string]: string;
}

interface MemoSummary {
    sum_amount_debit: number;
    transactions_count: number;
}

interface MemoExistence {
    memo_exists_in_memos: boolean;
}

interface WeekSummary {
    memo: string;
    weekly_amount_debit: number;
}

interface MonthSummary {
    memo: string;
    monthly_amount_debit: number;
}

interface MemoSumAmountDebits {
    memo: string;
    total_debit: number;
}

interface DaySummary {
    memo: string;
    daily_amount_debit: number;
}


interface AddressResponse {
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


type TransactionsList = { rows: Array<Transaction> };


type ArcDataObject<T> = d3.DefaultArcObject & { data: PieChartData };

interface MemoGroup {
    date: string;
    memos: { memo: string, amount: number }[];
}

interface PieChartData {
    label: string;
    value: number;
}

interface TimelineChartProps {
    debitsByMonth: { [key: string]: number };
}

interface Memo {
    Memo: string
}

interface DayYear {
    day: string;
}

interface MonthYear {
    month_year: string;
}

interface WeekYear {
    week_year: string;
}

interface Year {
    year: string;
}

type TimeframeType = 'day' | 'week' | 'month' | 'year';

type FetchTransactionsParams = {
    limit?: number;
    offset?: number;
    memo?: string;
    timeFrame?: TimeframeType;
    date?: Date | null | undefined;
    pageParams?: { limit?: number; offset?: number; };
}

type OFSummaryTypeBase = {
    total_debit: number;
    year: string;
    day_number?: string;
    week_number?: string;
    month_number?: string;
    json?: JsonObjectType;
}

type JsonObjectType = {
    total_debit: number;
    month_number: string;
    year: string;
};

type OFSummary = OFSummaryTypeBase;

type MJSummary = OFSummaryTypeBase;

type Summary = OFSummary | MJSummary;

type Summaries = {
    period: string;
    total_debit: number;
    total_credit: number;
    amount_difference: number;
};

type CategoryTreeNode = {
    value: string | number;
    label: string;
    children?: CategoryTreeNode[];
}

type CategoryTreeData = CategoryTreeNode[];


export type {
    AddressFields,
    AddressResponse,
    CategoryTreeNode,
    CategoryTreeData,
    DayYear,
    DaySummary,
    Transaction,
    TransactionData,
    TransactionsList,
    FetchTransactionsParams,
    Memo,
    MemoGroup,
    MemoSummary,
    MemoSumAmountDebits,
    MonthYear,
    PieChartData,
    ArcDataObject,
    TimelineChartProps,
    WeekYear,
    Year,
    WeekSummary,
    MonthSummary,
    OFSummary,
    OFSummaryTypeBase,
    MJSummary,
    Summary,
    Summaries
};
