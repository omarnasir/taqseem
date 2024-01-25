import { useEffect, useState } from 'react';

import { Text, VStack} from '@chakra-ui/react'

import { type TransactionWithDetails } from "@/types/model/transactions";
import { getTransactionsByGroupId } from "@/client/services/group-service";
import { GroupWithMembers } from '@/types/model/groups';
import TransactionListItem from './list-item';


export default function TransactionsList({ group, refreshTransactions, setRefreshTransactions }:
  { group: GroupWithMembers, refreshTransactions: string, setRefreshTransactions: React.Dispatch<React.SetStateAction<string>> }) {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);

  async function fetchTransactions(groupId: string) {
    const res = await getTransactionsByGroupId(groupId);
    if (res.success) {
      setTransactions(res.data);
    }
  }

  useEffect(() => {
    fetchTransactions(group.id);
  }, [group.id, refreshTransactions]);


  return (
    <VStack w='100%'>
      {!!transactions &&
        transactions.map((transaction) => (
          <TransactionListItem key={transaction.id} {...{transaction, 
            setRefreshTransactions,
            groupId: group.id}} />
        ))}
    </VStack >
  )
}