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

export type { Transaction, TransactionsList };