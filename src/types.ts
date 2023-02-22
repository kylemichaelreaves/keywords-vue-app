import * as d3 from "d3";

type Transaction = {
    "Transaction Number"?: string;
    Date: string;
    Description: string;
    Memo: string;
    "Amount Debit": string;
    "Amount Credit"?: string;
    Balance?: string;
    "Check Number"?: string;
    Fees?: string;
};

type TransactionsList = { data: Array<Transaction> };


type ArcDataObject<T> = d3.DefaultArcObject & { data: PieChartData };

interface PieChartData {
    label: string;
    value: number;
}

interface TimelineChartProps {
    debitsByMonth: { [key: string]: number };
}

export type { Transaction, TransactionsList, PieChartData, ArcDataObject, TimelineChartProps };