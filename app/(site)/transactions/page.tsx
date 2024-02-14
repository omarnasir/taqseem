'use client'
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from 'next-auth/react';

import AddTransaction from "./_components/add-transaction"
import { AmountDisplay, DateDisplay, cardItemWidths, SummaryDisplay } from "./_components/transactions-list"
import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { deleteTransaction } from '@/app/(site)/transactions/_lib/transactions-service';
import { GroupWithMembers } from "@/app/_types/model/groups"
import { getGroupDetails } from "@/app/(site)/groups/_lib/group-service"
import { getTransactionsByUserAndGroupId } from "@/app/(site)/transactions/_lib/transactions-service";
import Loading from "@/app/(site)/loading"
import { getTransactionIcon } from "@/app/_lib/db/constants";
import Confirm from "@/app/(site)/_components/confirm";

import { 
  Divider, 
  HStack, 
  VStack, 
  Text,
  useDisclosure,
  Button,
  Card,
  CardBody,
  IconButton,
  Icon
 } from "@chakra-ui/react"

import { MdOutlineAdd, MdDelete } from "react-icons/md"
import { CustomToast } from "@/app/_components/toast";

export default function GroupTransactions() {
  // get params from the router using url search
  const searchParams = useSearchParams();
  const groupId = searchParams.get('id');

  const { data: sessionData } = useSession();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);

  const { isOpen: isOpenAddTransaction, onOpen: onOpenAddTransaction, onClose: onCloseAddTransaction } = useDisclosure()
  const { isOpen: isOpenRemoveTransaction, onOpen: onOpenRemoveTransaction, onClose: onCloseRemoveTransaction } = useDisclosure()
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<GroupWithMembers>();
  const [refreshTransactions, setRefreshTransactions] = useState<string>('');
  const { addToast } = CustomToast();

  async function onRemoveTransaction(id: number) {
    const res = await deleteTransaction({ id: id, groupId: group!.id, userId: sessionData!.user.id })
    if (res.success) {
      addToast(`Transaction removed`, null, 'success')
      setRefreshTransactions(Date.now().toString())
    }
    else {
      addToast('Cannot delete transaction.', res.error, 'error')
    }
  }

  useEffect(() => {
    const fetchGroupDetails = async () => {
      await getGroupDetails(groupId!).then((res) => {
        setGroup(res.data);
      }).then(() => {
        getTransactionsByUserAndGroupId(groupId!, sessionData?.user.id!).then((res) => {
          setTransactions(res.data);
          setLoading(false);
        });
      })
    }
    fetchGroupDetails();
  }, [groupId, sessionData?.user.id, refreshTransactions]);

  return (
    loading ? <Loading /> :
      <VStack w='100%'>
        <HStack w='100%' justifyContent={'space-between'}>
          <VStack alignItems={'flex-start'}>
            <Text fontSize='xl' fontWeight='bold'>{group?.name}</Text>
            <Text fontSize='md' fontWeight='400'>Transactions</Text>
          </VStack>
          <Button width={'6rem'} fontWeight={500} variant={'add'} size={'md'}
            fontSize={'sm'} onClick={onOpenAddTransaction}>Add</Button>
        </HStack>
        <Divider marginY={2} />
        <AddTransaction {...{ group: group!, onClose: onCloseAddTransaction, isOpen: isOpenAddTransaction, setRefreshTransactions }} />
        <VStack w='100%'>
          {!!transactions &&
            transactions.map((transaction) => (
              <Card variant={'custom'} w='100%' key={transaction.id}>
                <CardBody padding={2} w='100%'>
                  <HStack>
                    <DateDisplay paidAt={transaction.paidAt} />
                    <Icon as={getTransactionIcon(transaction.category)} width={cardItemWidths['icon']} h='8' />
                    <SummaryDisplay transaction={transaction} users={group?.users!} />
                    <AmountDisplay transactionDetails={transaction.transactionDetails} userId={sessionData!.user.id} />
                    <IconButton width={cardItemWidths['delete']}
                      onClick={onOpenRemoveTransaction}
                      icon={<MdDelete />}
                      variant={'ghost'}
                      opacity={0.7}
                      aria-label='Delete' size={'md'} />
                  </HStack>
                </CardBody>
                <Confirm isOpen={isOpenRemoveTransaction} onClose={onCloseRemoveTransaction} callback={() => {
                  onRemoveTransaction(transaction.id); onCloseRemoveTransaction();
                }} mode="removeTransaction" />
              </Card>
            ))}
        </VStack >
      </VStack>
  )
}