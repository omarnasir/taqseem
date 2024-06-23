import { Prisma } from '@prisma/client'

const activityGetArgs = Prisma.validator<Prisma.ActivityDefaultArgs>()({
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
export type ActivityGetArgs = Prisma.ActivityGetPayload<typeof activityGetArgs>
