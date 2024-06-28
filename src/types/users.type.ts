import { Prisma } from '@prisma/client'

// 1: Define a type that includes the ownership of `Group`
const userOwnedGroups = Prisma.validator<Prisma.UsersDefaultArgs>()({
  select: { ownedGroups: true },
})

// 2: Define a type that includes the relation to `Group`
const userGroups = Prisma.validator<Prisma.UsersDefaultArgs>()({
  select: { groups: true },
})

const userBasicData = Prisma.validator<Prisma.UsersDefaultArgs>()({
  select: { id: true, name: true },
})
const userPersonalData = Prisma.validator<Prisma.UsersDefaultArgs>()({
  select: { email: true },
})

// 3: This type will include a user and all their posts
export type UserGroups = Prisma.UsersGetPayload<typeof userGroups & typeof userPersonalData>
export type UserOwnedGroups = Prisma.UsersGetPayload<typeof userOwnedGroups & typeof userPersonalData>
export type UserBasicData = Prisma.UsersGetPayload<typeof userBasicData>
export type UserPersonalData = Prisma.UsersGetPayload<typeof userPersonalData & typeof userBasicData>

export type BalancesByUserGroups = {
  [groupId: string]: {
    groupName: string;
    lent: number;
    spent: number;
    balance: number;
  }
}