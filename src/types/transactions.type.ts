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
