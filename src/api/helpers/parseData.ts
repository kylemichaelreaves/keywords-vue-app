import * as d3 from "d3";

export function parseData(data: string): {
    Description: string;
    "Transaction Number": string;
    amountDebit: string;
    amountCredit: string;
    Date: string;
    Memo: string
}[] {
    return d3.dsvFormat(',').parse(data).map(row => ({
        'Transaction Number': row['Transaction Number'] ?? '',
        Date: row.Date ?? '',
        Description: row.Description ?? '',
        Memo: row.Memo ?? '',
        'amountDebit': row['Amount Debit'] ?? '',
        'amountCredit': row['Amount Credit'] ?? '',
    }));
}