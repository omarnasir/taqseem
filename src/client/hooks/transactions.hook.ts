'use client'
import { useInfiniteQuery } from "@tanstack/react-query";
import { type TransactionsService,
  TransactionWithDetails
 } from "@/types/transactions.type";


export function useGetGroupTransactions(groupId: string, transactionsInitialData: TransactionsService) {
  const query = useInfiniteQuery({
    queryKey: ['transactions', groupId],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/groups/transactions?groupId=${groupId}${pageParam ? `&cursor=${pageParam}` : ''}`);
      const data = await res.json();
      return data as TransactionsService
    },
    initialPageParam: transactionsInitialData.prevCursor,
    initialData: { pages: [transactionsInitialData], pageParams: [transactionsInitialData.prevCursor] },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage?.prevCursor,
    maxPages: 3,
  });

  let transactions: TransactionWithDetails[] = [];
  query.data.pages.forEach((page) => {
    page.transactions.forEach((transaction) => {
      const transactionIndex = transactions.findIndex((transactionOld) => transactionOld.id === transaction.id);
      if (transactionIndex === -1) {
        transactions.push(transaction);
      }
    });
  });

  return { ...query, transactions }
}