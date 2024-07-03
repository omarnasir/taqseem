import { Prisma } from '@prisma/client'

const membershipDefaultArgs = Prisma.validator<Prisma.MembershipsDefaultArgs>()({
  select: { groupId: true, userId: true }
})

export type CreateMembershipArgs = {
  groupId: string,
  userEmail: string,
}

/**
 * A Membership type to indicate a relationship between a user and a group.
 */
export type Membership = Prisma.MembershipsGetPayload<typeof membershipDefaultArgs>
