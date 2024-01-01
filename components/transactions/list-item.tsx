import { 
  Box,
  Text
 } from "@chakra-ui/react";

import { Transaction } from "@/types/model/transactions";


export default function TransactionListItem(
  { transaction }: { transaction: Transaction }
) {
  return (
    <Box key={transaction.id} p={5} shadow="md" borderWidth="1px">
      <Text>{transaction.name}</Text>
      <Text>{transaction.amount}</Text>
      <Text>{transaction.category}</Text>
      <Text>{transaction.paidById}</Text>
    </Box>
  )
}