import { Prisma } from '@prisma/client'
import { UserBasicData } from './users.type'

const groupWithOwnership = Prisma.validator<Prisma.GroupsDefaultArgs>()({
  include: { createdBy: true },
})

const groupData = Prisma.validator<Prisma.GroupsDefaultArgs>()({
  select: { id: true, name: true, createdById: true }
})

export type GroupData = Prisma.GroupsGetPayload<typeof groupData>
export type GroupWithOwnership = Prisma.GroupsGetPayload<typeof groupWithOwnership>
export type GroupWithMembers = Prisma.GroupsGetPayload<typeof groupData> & {users: UserBasicData[]}
export type CreateGroup = Prisma.GroupsUncheckedCreateInput

export type GroupAndCreatedByID = {
  groupId: string;
  createdById: string;
}

export type GroupBalanceDetails = {
  users: {
    userId: string;
    userName: string;
    lent: number;
    spent: number;
    balance: number;
  }[]
}

export type GroupBalanceDetailsWithName = GroupBalanceDetails & { groupName: string }