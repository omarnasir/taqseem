import { 
  type CreateTransactionWithDetails,
  type TransactionWithDetails,
  type TransactionDeleteArgs
} from '@/types/model/transactions';
import { type ServiceResponseType } from '@/client/services/types';
import { responseHandler } from '@/client/services/base';

type CreateResponseType = ServiceResponseType & {
  data?: CreateTransactionWithDetails
}
type DeleteResponseType = ServiceResponseType & {
  data?: TransactionDeleteArgs
}
type GETResponseType = ServiceResponseType & {
  data?: TransactionWithDetails
}

async function getTransaction(id: string): 
  Promise<GETResponseType> {
  const response = await fetch(`/api/transaction/?id=${id}`);
  return await responseHandler(response);
}

async function createTransaction(body: CreateTransactionWithDetails): 
  Promise<CreateResponseType> {
  const response = await fetch(`/api/transaction/`, {
    method: "POST",
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
  getTransaction,
  createTransaction,
  deleteTransaction
}