import { Prisma } from '@prisma/client'

const userMembershipsByGroup = Prisma.validator<Prisma.MembershipsDefaultArgs>()({
  select: { user: { select: { id:true, name: true } } }
})

const membershipDefaultArgs = Prisma.validator<Prisma.MembershipsDefaultArgs>()({
  select: { groupId: true, userId: true }
})

export type UserMembershipByGroup = Prisma.MembershipsGetPayload<typeof userMembershipsByGroup>['user']
export type MembershipDefaultArgs = Prisma.MembershipsGetPayload<typeof membershipDefaultArgs>