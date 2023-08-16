import {TransactionsList} from "@types/types";
import * as d3 from 'd3';
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";

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

export async function fetchTransactionsS3Client(): Promise<{
    Description: string;
    "Transaction Number": string;
    amountDebit: string;
    amountCredit: string;
    Date: string;
    Memo: string
}[]> {
    const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        }
    });
    const bucketParams = {
        Bucket: import.meta.env.VITE_S3_BUCKET,
        Key: 'transactions.csv'
    }
    try {
        const data = await s3Client.send(new GetObjectCommand(bucketParams));
        if (data.Body) {
            const csvString = await data.Body.transformToString();
            return parseData(csvString);
        } else {
            console.log('Data body is undefined');
            return [];
        }
    } catch (error) {
        console.log(error)
        return [];
    }
}
