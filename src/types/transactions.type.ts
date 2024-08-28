import {
  Prisma,
  type Transactions,
  type TransactionDetails
} from '@prisma/client'

// Re-export Prisma types to avoid import statements in components
export {
  type Transactions,
  type TransactionDetails
}

export type TransactionWithDetails = Transactions & {
  transactionDetails: TransactionDetails[]
}

export type CreateTransactionDetails = Prisma.TransactionDetailsUncheckedCreateWithoutTransactionInput
export type CreateTransaction = Omit<Prisma.TransactionsUncheckedCreateInput, 'transactionDetails'> & {
  transactionDetails: CreateTransactionDetails[]
}

export type UpdateTransactionDetails = Prisma.TransactionDetailsUncheckedUpdateWithoutTransactionInput
export type UpdateTransaction = Omit<Prisma.TransactionsUncheckedUpdateInput, 'transactionDetails'> & {
  transactionDetails: UpdateTransactionDetails[]
}

type FormTransactionDetails = Omit<TransactionDetails, 'amount'> & {
  amount?: string
}

export type FormTransaction = Omit<Transactions, 'amount' | 'paidAt'> & {
  amount?: string,
  paidAt: string,
  transactionDetails: FormTransactionDetails[]
}

export type GroupedTransactions = {
  year: number,
  data: {
    month: number,
    monthName: string,
    data: TransactionWithDetails[]
  }[]
}[]

export type GetTransactionsInput = {
  groupId: string,
  cursor: string,
  direction: 'prev' | 'next',
  isFirstFetch?: boolean
}

/**
 * The direction object is not required as a return param, however in the bi-directional InfiniteQuery
 * we have to set the direction parameter in the getNext/PrevPage functions, so it can be passed
 * on to the queryFn and eventually the data layer.
 */
export type GetTransactionsResponse = {
  transactions: TransactionWithDetails[],
  cursor: {
    next?: string,
    prev?: string,
    direction?: 'prev' | 'next'
  }
}
