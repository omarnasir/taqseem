'use client'
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from 'next-auth/react';

import { MdAdd } from "react-icons/md"

import TransactionView from "./_components/view-transaction"
import { AmountDisplay, DateDisplay, cardItemWidths, SummaryDisplay } from "./_components/card-items"
import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { GroupWithMembers } from "@/app/_types/model/groups"
import { getGroupDetails } from "@/app/(site)/groups/_lib/group-service"
import { getTransactionsByUserAndGroupId, type GroupedTransactions } from "@/app/(site)/transactions/_lib/transactions-service";
import Loading from "@/app/(site)/loading"
import { getTransactionIcon } from "@/app/_lib/db/constants";

import {
  Divider,
  Text,
  useDisclosure,
  ListItem,
  List,
  ListIcon,
  Flex,
  IconButton,
} from "@chakra-ui/react"


export default function GroupTransactions() {
  // get params from the router using url search
  const searchParams = useSearchParams();
  const groupId = searchParams.get('id');

  const { data: sessionData } = useSession();
  const [transactions, setTransactions] = useState<GroupedTransactions>([]);
  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure()
  const [group, setGroup] = useState<GroupWithMembers>();
  const [refreshTransactions, setRefreshTransactions] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails>();

  const { onClick, buttonProps } = getButtonProps();
  const disclosureProps = getDisclosureProps({
    transaction: selectedTransaction,
  });

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const res = await getGroupDetails(groupId!)
      setGroup(res.data);
    }
    const fetchTransactions = async () => {
      const res = await getTransactionsByUserAndGroupId(groupId!, sessionData?.user.id!)
      if (res.data) setTransactions(res.data);
    }
    fetchGroupDetails();
    fetchTransactions();
  }, [groupId, sessionData, refreshTransactions]);

  return (group == undefined ? <Loading /> :
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text fontSize='lg' alignSelf={'center'} fontWeight='300' textAlign={'center'} zIndex={1}
        position={'sticky'} top={'-40px'}>{group?.name}</Text>
      <IconButton variant={'new'} size={'lg'}
          icon={<MdAdd />} 
          onClick={() => { setSelectedTransaction(undefined); onClick() }}
          {...buttonProps}>new</IconButton>
      {transactions.map((yearData, index) => (
        <List w='100%' variant={'transaction'} key={index}>
          <Divider marginY={1} />
          <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'xs'} fontWeight={600} color={'whiteAlpha.800'}>{yearData.year}</Text>
          {yearData.data.map((monthData) => (
            <>
              <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'xs'} fontWeight={300} color={'whiteAlpha.600'}>{monthData.monthName}</Text>
              {monthData.data.map((transaction) => (
                <ListItem w='100%' key={transaction.id}
                  flexDirection={'row'} display={'flex'} justifyContent={'space-between'}
                  onClick={
                    () => {
                      setSelectedTransaction(transaction)
                      onClick();
                    }
                  }>
                  <DateDisplay paidAt={transaction.paidAt} />
                  <ListIcon as={getTransactionIcon(transaction.category)} width={cardItemWidths['icon']} h='5' color='whiteAlpha.700' />
                  <SummaryDisplay transaction={transaction} users={group?.users!} />
                  <AmountDisplay transactionDetails={transaction.transactionDetails} userId={sessionData!.user.id} />
                </ListItem>
              ))}
            </>
          ))}
        </List >
      ))}
      {isOpen &&
        <TransactionView
          {...{
            disclosureProps,
            isOpen, onCloseDrawer: onClose,
            group: group!,
            setRefreshTransactions,
            transactionWithDetails: selectedTransaction,
          }} />
      }
    </Flex>
  )
}