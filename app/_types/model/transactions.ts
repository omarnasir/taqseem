import { Prisma } from '@prisma/client'

const transaction = Prisma.validator<Prisma.TransactionsDefaultArgs>()({
  include: { transactionDetails: true }
})

export type TransactionDeleteArgs = {
  id: number,
  groupId: string,
  userId: string
}

export type TCreateTransaction = Prisma.TransactionsUncheckedCreateInput
export type TCreateTransactionDetails = Prisma.TransactionDetailsUncheckedCreateWithoutTransactionInput

export type TTransactionWithDetails = Prisma.TransactionsGetPayload<typeof transaction>
