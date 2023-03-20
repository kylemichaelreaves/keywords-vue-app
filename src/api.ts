import {TransactionsList} from "./types";
import * as d3 from 'd3';
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import axios from "axios";
import {API_GATEWAY_URL, LAMBDA_DEV_URL} from "./constants";

export function parseData(data: string): TransactionsList['data'] {
    return d3.dsvFormat(',').parse(data).map(row => ({
        'Transaction Number': row['Transaction Number'] ?? '',
        Date: row.Date ?? '',
        Description: row.Description ?? '',
        Memo: row.Memo ?? '',
        'Amount Debit': row['Amount Debit'] ?? '',
        'Amount Credit': row['Amount Credit'] ?? '',
    }));
}

export async function fetchTransactionsS3Client(): Promise<TransactionsList['data']> {
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

export async function fetchTransactionsRDS(limit: number, offset: number): Promise<TransactionsList['data']> {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/transactions/get-transactions`, {
            params: {
                limit,
                offset,
            },
        });
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.log('error', error.message);
        return [];
    }
}