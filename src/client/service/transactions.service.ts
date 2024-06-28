import { GroupedTransactions } from "@/types/transactions.type"

export async function fetchGroupTransactions(groupId: string, cursor?: number) {
  const res = await fetch(`/api/groups/transactions?groupId=${groupId}${cursor ? `&cursor=${cursor}` : ''}`)
  const data = await res.json()
  return data as {groupedTransactions: GroupedTransactions, cursor: number}
}