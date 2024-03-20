import { 
  UpdateTransaction,
  type CreateTransaction,
  type TransactionWithDetails,
  type TransactionDeleteArgs
} from '@/app/_types/model/transactions';
import { GroupedTransactions } from "@/app/api/users/groups/transactions/route"
import { responseHandler, type ServiceResponseType } from '@/app/_lib/base-service';

type CreateResponseType = ServiceResponseType & {
  data?: CreateTransaction
}
type DeleteResponseType = ServiceResponseType & {
  data?: TransactionDeleteArgs
}
type GETResponseType = ServiceResponseType & {
  data?: TransactionWithDetails
}
type GETTransactionsResponseType = ServiceResponseType & {
  data?: TransactionWithDetails[]
}

type GETGroupedTransactionsResponseType = Omit<ServiceResponseType, "data"> & {
  data?: GroupedTransactions
}

async function getTransactionsByGroupId(id: string): Promise<GETTransactionsResponseType> {
  const response = await fetch(`/api/groups/transactions/?id=${id}`)
  return await responseHandler(response);
}

async function getTransactionsByUserAndGroupId(groupId: string, userId: string): Promise<GETGroupedTransactionsResponseType> {
  const response = await fetch(`/api/users/groups/transactions/?groupId=${groupId}&userId=${userId}`);
  return await responseHandler(response);
}

async function getTransaction(id: string): 
  Promise<GETResponseType> {
  const response = await fetch(`/api/transaction/?id=${id}`);
  return await responseHandler(response);
}

async function createTransaction(body: CreateTransaction): 
  Promise<CreateResponseType> {
  const response = await fetch(`/api/transaction/`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return await responseHandler(response);
}

async function updateTransaction(body: UpdateTransaction): 
  Promise<CreateResponseType> {
  const response = await fetch(`/api/transaction/`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
  return await responseHandler(response);
}

async function deleteTransaction(reqData: TransactionDeleteArgs): 
  Promise<DeleteResponseType> {
  const response = await fetch(`/api/transaction`, {
    method: "DELETE",
    body: JSON.stringify(reqData)
  });
  return await responseHandler(response);
}

export {
  getTransactionsByGroupId,
  getTransactionsByUserAndGroupId,
  getTransaction,
  type GroupedTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
}