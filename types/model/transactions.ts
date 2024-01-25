import { Prisma } from '@prisma/client'

const transaction = Prisma.validator<Prisma.TransactionsDefaultArgs>()({
  include: { transactionDetails: true }
})

export type TransactionDeleteArgs = {
  id: number,
  groupId: string,
  userId: string
}

type createTransaction = Prisma.TransactionsUncheckedCreateInput
type createTransactionDetails = Prisma.TransactionDetailsUncheckedCreateWithoutTransactionInput

export type CreateTransactionWithDetails = createTransaction & {
  transactionDetails: createTransactionDetails[]
}
export type TransactionWithDetails = Prisma.TransactionsGetPayload<typeof transaction>
