import { Prisma } from '@prisma/client'

// 1: Define a type that includes the ownership of `Group`
const groupsWithOwnership = Prisma.validator<Prisma.GroupsDefaultArgs>()({
  include: { createdBy: true },
})

// 2: Define a type that includes the relation to `Group`
const groupWithMembers = Prisma.validator<Prisma.GroupsDefaultArgs>()({
  include: { users: true },
})

// 3: Define a type that only contains a subset of the scalar fields
const groupData = Prisma.validator<Prisma.GroupsDefaultArgs>()({
  select: { id: true, name: true, createdById: true }
})

const groupDeleteArgs = Prisma.validator<Prisma.GroupsDefaultArgs>()({
  select: { id: true, createdById: true }
})

// 3: This type will include a user and all their posts
export type GroupWithOwnership = Prisma.GroupsGetPayload<typeof groupsWithOwnership>
export type GroupWithMembers = Prisma.GroupsGetPayload<typeof groupWithMembers>
export type GroupData = Prisma.GroupsGetPayload<typeof groupData>
export type CreateGroup = Prisma.GroupsCreateArgs['data']
export type GroupDeleteArgs = Prisma.GroupsGetPayload<typeof groupDeleteArgs>