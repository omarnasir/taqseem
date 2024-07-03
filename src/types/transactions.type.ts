import { Prisma } from '@prisma/client'

const transaction = Prisma.validator<Prisma.TransactionsDefaultArgs>()({
  include: { transactionDetails: true }
})

export type CreateTransactionDetails = Prisma.TransactionDetailsUncheckedCreateWithoutTransactionInput
export type CreateTransaction = Omit<Prisma.TransactionsUncheckedCreateInput, 'transactionDetails'> & {
  transactionDetails: CreateTransactionDetails[]
}

export type UpdateTransactionDetails = Prisma.TransactionDetailsUncheckedUpdateWithoutTransactionInput
export type UpdateTransaction = Omit<Prisma.TransactionsUncheckedUpdateInput, 'transactionDetails'> & {
  transactionDetails: UpdateTransactionDetails[]
}

export type TransactionWithDetails = Prisma.TransactionsGetPayload<typeof transaction>

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
