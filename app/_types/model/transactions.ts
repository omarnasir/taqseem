import { Prisma } from '@prisma/client'

const transaction = Prisma.validator<Prisma.TransactionsDefaultArgs>()({
  include: { transactionDetails: true }
})

export type TransactionDeleteArgs = {
  id: number,
  groupId: string,
  userId: string
}

export type TCreateTransactionDetails = Prisma.TransactionDetailsUncheckedCreateWithoutTransactionInput
export type TCreateTransaction = Omit<Prisma.TransactionsUncheckedCreateInput, 'transactionDetails'> & {
  transactionDetails: TCreateTransactionDetails[]
}

export type TUpdateTransactionDetails = Prisma.TransactionDetailsUncheckedUpdateWithoutTransactionInput
export type TUpdateTransaction = Omit<Prisma.TransactionsUncheckedUpdateInput, 'transactionDetails'> & {
  transactionDetails: TUpdateTransactionDetails[]
}

export type TTransactionWithDetails = Prisma.TransactionsGetPayload<typeof transaction>
