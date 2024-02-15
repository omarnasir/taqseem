'use client'
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from 'next-auth/react';

import TransactionView from "./_components/view-transaction"
import { AmountDisplay, DateDisplay, cardItemWidths, SummaryDisplay } from "./_components/transactions-list"
import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { GroupWithMembers } from "@/app/_types/model/groups"
import { getGroupDetails } from "@/app/(site)/groups/_lib/group-service"
import { getTransactionsByUserAndGroupId } from "@/app/(site)/transactions/_lib/transactions-service";
import Loading from "@/app/(site)/loading"
import { getTransactionIcon } from "@/app/_lib/db/constants";

import {
  Divider,
  HStack,
  VStack,
  Text,
  useDisclosure,
  Button,
  Card,
  CardBody,
  Icon,
} from "@chakra-ui/react"

export default function GroupTransactions() {
  // get params from the router using url search
  const searchParams = useSearchParams();
  const groupId = searchParams.get('id');

  const { data: sessionData } = useSession();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [group, setGroup] = useState<GroupWithMembers>();
  const [refreshTransactions, setRefreshTransactions] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails>();

  const onCloseCallback = () => {
    setSelectedTransaction(undefined);
    onClose();
  }

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const res = await getGroupDetails(groupId!)
      setGroup(res.data);
    }
    const fetchTransactions = async () => {
      const res = await getTransactionsByUserAndGroupId(groupId!, sessionData?.user.id!)
      setTransactions(res.data);
    }
    fetchGroupDetails();
    fetchTransactions();
  }, [groupId, sessionData, refreshTransactions]);

  return (
    group == undefined ? <Loading /> :
      <VStack w='100%'>
        <HStack w='100%' justifyContent={'space-between'}>
          <VStack alignItems={'flex-start'}>
            <Text fontSize='xl' fontWeight='bold'>{group?.name}</Text>
            <Text fontSize='md' fontWeight='400'>Transactions</Text>
          </VStack>
          <Button width={'6rem'} fontWeight={500} variant={'add'} size={'md'}
            fontSize={'sm'} onClick={onOpen}>Add</Button>
        </HStack>
        <Divider marginY={2} />
        <VStack w='100%'>
          {!!transactions &&
            transactions.map((transaction) => (
              <Card variant={'custom'} w='100%' key={transaction.id} mb={2}
                onClick={
                  () => {
                    setSelectedTransaction(transaction);
                    onOpen();
                  }
                }>
                <CardBody padding={2} w='100%'>
                  <HStack>
                    <DateDisplay paidAt={transaction.paidAt} />
                    <Icon as={getTransactionIcon(transaction.category)} width={cardItemWidths['icon']} h='6' />
                    <SummaryDisplay transaction={transaction} users={group?.users!} />
                    <AmountDisplay transactionDetails={transaction.transactionDetails} userId={sessionData!.user.id} />
                  </HStack>
                </CardBody>
              </Card>
            ))}
        </VStack >
        <TransactionView {...{
          group: group!,
          disclosureMethods: {
            onClose: onCloseCallback,
            isOpen: isOpen
          },
          setRefreshTransactions,
          transactionWithDetails: selectedTransaction,
        }} />
      </VStack>
  )
}