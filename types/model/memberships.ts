import { Prisma } from '@prisma/client'

const membershipDefaultArgs = Prisma.validator<Prisma.MembershipsDefaultArgs>()({
  select: { groupId: true, userId: true }
})

export type CreateMembershipArgs = {
  groupId: string,
  userEmail: string,
}

export type MembershipDefaultArgs = Prisma.MembershipsGetPayload<typeof membershipDefaultArgs>
