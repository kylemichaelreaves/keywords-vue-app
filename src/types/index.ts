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

interface WeekSummary {
    memo: string;
    weekly_amount_debit: number;
}

interface MonthSummary {
    memo: string;
    monthly_amount_debit: number;
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

interface MonthYear {
    month_year: string;
}

interface WeekYear {
    week_year: string;
}

type TimeframeType = 'day' | 'week' | 'year';

type OfSummaryTypeBase = {
    total_debit: number;
    year: string;
    day_number?: string;
    week_number?: string;
    month_number?: string;
}

type OFSummary = OfSummaryTypeBase;

type MJSummary = OfSummaryTypeBase;

type Summary = OFSummary | MJSummary;

type Summaries = {
    period: string;
    total_debit: number;
    total_credit: number;
    amount_difference: number;
};

export type {
    AddressFields,
    AddressResponse,
    Transaction,
    TransactionData,
    TransactionsList,
    Memo,
    MemoGroup,
    MemoSummary,
    MonthYear,
    PieChartData,
    ArcDataObject,
    TimelineChartProps,
    WeekYear,
    WeekSummary,
    MonthSummary,
    OFSummary,
    MJSummary,
    Summary,
    Summaries,
};
