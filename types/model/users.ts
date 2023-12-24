import { Prisma } from '@prisma/client'

// 1: Define a type that includes the ownership of `Group`
const userWithOwnedGroups = Prisma.validator<Prisma.UsersDefaultArgs>()({
  include: { ownedGroups: true },
})

// 2: Define a type that includes the relation to `Group`
const userBelongingToGroups = Prisma.validator<Prisma.UsersDefaultArgs>()({
  include: { groups: true },
})

// 3: Define a type that only contains a subset of the scalar fields
const userPersonalData = Prisma.validator<Prisma.UsersDefaultArgs>()({
  select: { id: true, email: true, name: true },
})

// 3: This type will include a user and all their posts
export type UserWithOwnedGroups = Prisma.UsersGetPayload<typeof userWithOwnedGroups>
export type UserBelongingToGroups = Prisma.UsersGetPayload<typeof userBelongingToGroups>
export type UserPersonalData = Prisma.UsersGetPayload<typeof userPersonalData>