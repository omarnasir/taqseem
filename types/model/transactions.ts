import { Prisma } from '@prisma/client'

const transaction = Prisma.validator<Prisma.TransactionDetailsDefaultArgs>()({
  select: { transaction: true }
})

export type CreateTransaction = Prisma.TransactionDetailsCreateArgs['data']
export type Transaction = Prisma.TransactionDetailsGetPayload<typeof transaction>['transaction']