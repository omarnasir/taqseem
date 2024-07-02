'use client'
import { useInfiniteQuery, g, useQueryClient, useMutation } from "@tanstack/react-query";
import { type GetTransactionsResponse,
  TransactionWithDetails,
  GroupedTransactions
 } from "@/types/transactions.type";


export function useGetGroupTransactions(groupId: string, transactionsInitialData: GetTransactionsResponse) {
  const query = useInfiniteQuery({
    queryKey: ['transactions', groupId],
    queryFn: async ({ pageParam }) => {
      const cursorToSend = pageParam.direction === 'next' ? pageParam.next : pageParam.prev;
      const res = await fetch(`/api/groups/transactions?groupId=${groupId}&cursor=${cursorToSend}&direction=${pageParam.direction}`);
      const data = await res.json() as GetTransactionsResponse;
      return data
    },
    initialPageParam: { direction: 'next'},
    initialData: { pages: [transactionsInitialData], pageParams: [transactionsInitialData.cursor] },
    getNextPageParam: (lastPage) => {
      lastPage.cursor.direction = 'next'
      return lastPage.cursor.next ? lastPage.cursor : undefined
    },
    getPreviousPageParam: (firstPage) => {
      firstPage.cursor.direction = 'prev'
      return firstPage.cursor.prev !== transactionsInitialData.cursor.prev ? firstPage.cursor : undefined
    },
    maxPages: 3,
    enabled: false,
  });

  let transactions: TransactionWithDetails[] = [];
  query.data.pages.forEach((page) => {
    page.transactions.forEach((transaction) => {
      transactions.push(transaction);
    });
  });

  let data: GroupedTransactions = []
  for (const transaction of transactions) {
    const date = new Date(transaction.paidAt);
    const month = date.getMonth()
    const year = date.getFullYear()
    if (!data.find((group) => group.year === year)) {
      data.push({ year, data: [] })
    }
    const groupIndex = data.findIndex((group) => group.year === year)
    if (!data[groupIndex].data.find((data) => data.month === month)) {
      data[groupIndex].data.push({ month, monthName: date.toLocaleString('default', { month: 'long' }), data: [] })
    }
    const monthIndex = data[groupIndex].data.findIndex((data) => data.month === month)
    data[groupIndex].data[monthIndex].data.push(transaction)
  }
  data.sort((a, b) => b.year - a.year)
  for (const group of data) {
    group.data.sort((a, b) => b.month - a.month)
  }
  return { ...query, transactions: data }
}

export function useMutationAction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: async (mutationData: 
    {
      action: 'create' | 'update' | 'remove', 
      data?: TransactionWithDetails,
      transactionId: number,
      groupId: string
    }) => {
    queryClient.setQueryData(['transactions', mutationData.groupId], (queryData: { pages: GetTransactionsResponse[], pageParams: string[] }) => {
      queryData.pages.forEach((page: GetTransactionsResponse, index) => {
        if (mutationData.action === 'update') {
            page.transactions.forEach((transaction, index) => {
              if (transaction.id === mutationData.transactionId) {
                page.transactions[index] = mutationData.data as TransactionWithDetails
              }
            })
        }
        else if (mutationData.action === 'remove') {
            page.transactions = page.transactions.filter((transaction) => transaction.id !== mutationData.transactionId)
        }
        else if (mutationData.action === 'create') {
            page.transactions.unshift(mutationData.data as TransactionWithDetails)
        }
      })
      return queryData
    })
  } });
  return mutation
}
