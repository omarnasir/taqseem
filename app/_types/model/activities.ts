import { Prisma } from '@prisma/client'

const activity = Prisma.validator<Prisma.ActivityDefaultArgs>()({
  select: {
    id: true,
    action: true,
    createdAt: true,
    transactionId: true,
    createdById: true,
    groupId: true,
    amount: true,
  }
})

const activityWithDetails = Prisma.validator<Prisma.ActivityDefaultArgs>()({
  include: {
    createdBy: {
      select: {
        name: true,
      }
    },
    transaction: {
      select: {
        name: true,
        isSettlement: true,
        category: true,
        paidById: true,
        group: {
          select: {
            name: true,
          }
        }
      }
    }
  }
})

export type CreateActivity = Prisma.ActivityUncheckedCreateInput
export type Activity = Prisma.ActivityGetPayload<typeof activity>
export type ActivityWithDetails = Prisma.ActivityGetPayload<typeof activityWithDetails> & { isInvolved: boolean }
