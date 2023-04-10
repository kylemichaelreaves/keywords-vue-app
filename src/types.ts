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

interface AddressResponse {
    osm_type: string;
    osm_id: number;
    licence: string;
    boundingbox: string[];
    address: {
        country: string;
        country_code: string;
        town?: string;
        road: string;
        "ISO3166-2-lvl4": string;
        county: string;
        neighbourhood?: string;
        village?: string;
        postcode: string;
        house_number: string;
        state: string
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

export type {
    AddressFields,
    AddressResponse,
    Transaction,
    TransactionData,
    TransactionsList,
    Memo,
    MemoGroup,
    MonthYear,
    PieChartData,
    ArcDataObject,
    TimelineChartProps
};