import { useEffect, useState } from 'react';

import {
  VStack,
  Card,
  CardBody,
  Text,
  Button
} from '@chakra-ui/react'

import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { getTransactionsByGroupId } from "@/app/(site)/groups/_lib/group-service";
import { deleteTransaction } from '@/app/(site)/groups/_lib/transaction-service';
import { GroupWithMembers } from '@/app/_types/model/groups';

import { CustomToast } from '@/app/_components/toast';
import { useSession } from 'next-auth/react';

export default function TransactionsList({ group, refreshTransactions, setRefreshTransactions }:
  { group: GroupWithMembers, refreshTransactions: string, setRefreshTransactions: React.Dispatch<React.SetStateAction<string>> }) {
  const { data: sessionData } = useSession();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);


  const { addToast } = CustomToast();

  async function fetchTransactions(groupId: string) {
    const res = await getTransactionsByGroupId(groupId);
    if (res.success) {
      setTransactions(res.data);
    }
  }

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: group.id, userId: sessionData!.user.id })
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      setRefreshTransactions(Date.now().toString())
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
    }
  }

  useEffect(() => {
    fetchTransactions(group.id);
  }, [group.id, refreshTransactions]);

  return (
    <VStack w='100%'>
      {!!transactions &&
        transactions.map((transaction) => (
          <Card variant={'custom'} w='100%' key={transaction.id}>
            <CardBody>
              <Text>{transaction.name}</Text>
              <Text>{transaction.category}</Text>
              <Text>{transaction.amount}</Text>
              <Text>{group.users!.find(user => user.id === transaction.paidById)?.name}</Text>
              <Text>{transaction.paidAt.toString()}</Text>
              <Button onClick={() => onRemoveTransaction(transaction.id)}>Remove</Button>
            </CardBody>
          </Card>
        ))}
    </VStack >
  )
}