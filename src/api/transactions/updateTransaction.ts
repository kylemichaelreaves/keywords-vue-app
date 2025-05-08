import { httpClient } from "@api/httpClient";
import type { Transaction } from "@types";

export async function updateTransaction(
  transaction: Partial<Transaction> & { id: string | number }
): Promise<Transaction> {
  if (!transaction.id) {
    throw new Error("Transaction ID is required for updates");
  }

  try {
    const response = await httpClient.patch(
      `/transactions/${transaction.id}`,
      transaction
    );
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}