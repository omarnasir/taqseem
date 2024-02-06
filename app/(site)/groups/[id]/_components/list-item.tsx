import { useSession } from "next-auth/react";
import { 
  Box,
  Button,
  Text
 } from "@chakra-ui/react";

import { TransactionWithDetails } from "@/app/_types/model/transactions";
import { deleteTransaction } from '@/app/(site)/groups/_lib/transaction-service';

import { CustomToast } from '@/app/_components/toast';


export default function TransactionListItem(
  { transaction, groupId, setRefreshTransactions }: 
  { transaction: TransactionWithDetails, groupId: string, setRefreshTransactions: React.Dispatch<React.SetStateAction<string>> }
) {
  const { data: sessionData } = useSession();

  const { addToast } = CustomToast();

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: groupId, userId: sessionData!.user.id})
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      setRefreshTransactions(Date.now().toString())
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
    }
  }

  return (
    <Box key={transaction.id} p={5} shadow="md" borderWidth="1px">
      <Text>{transaction.name}</Text>
      <Text>{transaction.amount}</Text>
      <Text>{transaction.category}</Text>
      <Text>{transaction.paidById}</Text>
      <Button onClick={() => onRemoveTransaction(transaction.id)}>Remove</Button>
    </Box>
  )
}