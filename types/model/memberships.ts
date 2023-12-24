import { Prisma } from '@prisma/client'

const userMembershipsByGroup = Prisma.validator<Prisma.MembershipsDefaultArgs>()({
  select: { user: { select: { id:true, name: true } } }
})

export type UserMembershipsByGroup = Prisma.MembershipsGetPayload<typeof userMembershipsByGroup>['user'][]