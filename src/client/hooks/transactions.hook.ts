'use client'
import { useInfiniteQuery } from "@tanstack/react-query";
import { GroupedTransactions } from "@/types/transactions.type";
import { fetchGroupTransactions } from "@/client/service/transactions.service";
import { useState } from "react";

export function useGetGroupTransactions(groupId: string,
  transactionsInitialData: {
    groupedTransactions: GroupedTransactions,
    cursor: number | undefined
  }) {
  const [cursor, setCursor] = useState(transactionsInitialData.cursor);
  const [transactions, setTransactions] = useState(transactionsInitialData.groupedTransactions);
  const query = useInfiniteQuery({
    queryKey: ['transactions', groupId],
    queryFn: async ({ pageParam }) => await fetchGroupTransactions(groupId, pageParam),
    initialPageParam: 0,
    initialData: { pages: [transactionsInitialData], pageParams: [0] },
    getNextPageParam: (lastPage, allPages) => lastPage?.cursor,
    maxPages: 3
  });

  if (cursor !== query.data?.pages[query.data.pages.length - 1].cursor) {
    let newTransactions = transactions;
    query.data.pages[query.data.pages.length - 1].groupedTransactions.forEach((yearData) => {
      const yearIndex = transactions.findIndex((yearDataOld) => yearDataOld.year === yearData.year);
      if (yearIndex === -1) {
        newTransactions.push(yearData);
      } else {
        yearData.data.forEach((monthData) => {
          const monthIndex = transactions[yearIndex].data.findIndex((monthDataOld) => monthDataOld.monthName === monthData.monthName);
          if (monthIndex === -1) {
            newTransactions[yearIndex].data.push(monthData);
          } else {
            newTransactions[yearIndex].data[monthIndex].data.push(...monthData.data);
          }
        });
      }
    }
    );
    setTransactions(newTransactions);
    setCursor(query.data.pages[query.data.pages.length - 1].cursor);
  }
  return { ...query, transactions };
}