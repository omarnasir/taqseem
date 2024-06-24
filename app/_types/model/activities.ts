import { Prisma } from '@prisma/client'

const activity = Prisma.validator<Prisma.ActivityDefaultArgs>()

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
export type ActivityWithDetails = Prisma.ActivityGetPayload<typeof activityWithDetails>
