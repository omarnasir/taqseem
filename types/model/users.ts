import { Prisma } from '@prisma/client'

// 1: Define a type that includes the ownership of `Group`
const userOwnedGroups = Prisma.validator<Prisma.UsersDefaultArgs>()({
  include: { ownedGroups: true },
})

// 2: Define a type that includes the relation to `Group`
const userGroups = Prisma.validator<Prisma.UsersDefaultArgs>()({
  include: { groups: true },
})

// 3: Define a type that only contains a subset of the scalar fields
const userPersonalData = Prisma.validator<Prisma.UsersDefaultArgs>()({
  select: { id: true, email: true, name: true },
})

// 3: This type will include a user and all their posts
export type UserGroups = Prisma.UsersGetPayload<typeof userGroups>
export type UserOwnedGroups = Prisma.UsersGetPayload<typeof userOwnedGroups>
export type UserPersonalData = Prisma.UsersGetPayload<typeof userPersonalData>