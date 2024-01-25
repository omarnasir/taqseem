import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { 
  Box,
  Button,
  Text
 } from "@chakra-ui/react";

import { TransactionWithDetails } from "@/types/model/transactions";
import { deleteTransaction } from '@/client/services/transaction-service';

import { CustomToast } from '@/components/toast';


export default function TransactionListItem(
  { transaction, groupId }: { transaction: TransactionWithDetails, groupId: string}
) {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { addToast } = CustomToast();

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: groupId, userId: sessionData!.user.id})
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      router.refresh();
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