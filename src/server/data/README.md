
Raw activity queries that can be used in the future:

```javascript

type ActivitiesByGroupIdsResult = Activity & {
  createdByName: string,
  transactionName: string,
  isSettlement: boolean,
  category: number,
  groupName: string,
  paidById: string,
  isInvolved: number
};

const where = Prisma.sql`AND id <= ${cursor}`;

const result : ActivitiesByGroupIdsResult[] = await prisma.$queryRaw`
  WITH activities AS (
    SELECT id, action, createdAt, transactionId, createdById, groupId, amount
    FROM activity
    WHERE groupId IN (${Prisma.join(groupIds)})
    ${cursor ? Prisma.sql`${where}` : Prisma.empty}
    ORDER BY id DESC
  ),
  groupsQuery AS (
    SELECT id, name as groupName
    FROM groups
    WHERE id IN (${Prisma.join(groupIds)})
  ),
  usersQuery AS (
    SELECT id, name as createdByName
    FROM users
  ),
  transactionsQuery AS (
    SELECT id, name, isSettlement, category, paidById, 
                      CASE WHEN td.transactionId IS NULL 
                          THEN 0
                          ELSE 1 
                          END AS isInvolved
    FROM transactions
    LEFT OUTER JOIN 
        (SELECT transactionId 
        FROM TransactionDetails 
        WHERE userId = ${userId}) AS td
    ON id = td.transactionId
    WHERE groupId IN (${Prisma.join(groupIds)})
  )
  SELECT 
    activities.id, 
    activities.action, 
    activities.createdAt, 
    activities.transactionId, 
    activities.createdById, 
    activities.groupId, 
    activities.amount,
    groupsQuery.groupName, 
    usersQuery.createdByName, 
    transactionsQuery.name as "transactionName",
    transactionsQuery.isSettlement, 
    transactionsQuery.category, 
    transactionsQuery.paidById, 
    transactionsQuery.isInvolved
  FROM activities
  JOIN groupsQuery ON activities.groupId = groupsQuery.id
  JOIN usersQuery ON activities.createdById = usersQuery.id
  JOIN transactionsQuery ON activities.transactionId = transactionsQuery.id
  ORDER BY activities.id DESC
  LIMIT 3`;
  if (!result || result.length === 0) return { activities: [], cursor: undefined };

  prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`)
});

  const activities : ActivityWithDetails[]  = result.map((activity) => {
    return {
      id: activity.id,
      action: activity.action,
      createdAt: activity.createdAt,
      transactionId: activity.transactionId,
      groupId: activity.groupId,
      createdById: activity.createdById,
      amount: activity.amount,
      isInvolved: activity.isInvolved === 0 ? false : true,
      group: {
        name: activity.groupName,
      },
      transaction: {
        name: activity.transactionName,
        isSettlement: activity.isSettlement,
        category: activity.category,
        paidById: activity.paidById,
      },
      createdBy: {
        name: activity.createdByName,
      }
    };
  }
  );

  if (activities.length <= TAKE_DEFAULT) return { activities, cursor: undefined };

  const nextCursor = activities[activities.length - 1].id;
  activities.pop();

  return { activities,  cursor: nextCursor };

```