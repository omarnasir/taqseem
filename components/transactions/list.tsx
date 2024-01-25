import { useEffect, useState } from 'react';

import { Text, Stack} from '@chakra-ui/react'

import { type TransactionWithDetails } from "@/types/model/transactions";
import { getTransactionsByGroupId } from "@/client/services/group-service";
import { GroupWithMembers } from '@/types/model/groups';
import TransactionListItem from './list-item';


export default function TransactionsList({group}: {group: GroupWithMembers}) {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getTransactionsByGroupId(group.id);
      if (res.success) {
        setTransactions(res.data);
      }
    }
    fetchData();
  }, [group.id])


  return (
    <Stack direction={'column'} spacing={4}>
      <Text fontSize='xl' fontWeight='bold'>Groups</Text>
      <Text size='sm' fontWeight='300'>Create or manage groups.</Text>
      {!!transactions &&
        transactions.map((transaction) => (
          <TransactionListItem key={transaction.id} {...{transaction, groupId: group.id}} />
        ))}
    </Stack >
  )
}