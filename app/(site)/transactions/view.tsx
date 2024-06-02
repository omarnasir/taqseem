'use client'
import React, { useState } from "react"
import { useSession } from 'next-auth/react';

import { MdAdd } from "react-icons/md"

import { TransactionView } from "./_components/view-transaction"
import { AmountDisplay, DateDisplay, cardItemWidths, SummaryDisplay } from "./_components/card-items"
import { type TransactionWithDetails } from "@/app/_types/model/transactions";
import { GroupWithMembers } from "@/app/_types/model/groups"
import { type GroupedTransactions } from "@/app/_service/transactions";
import Loading from "@/app/(site)/loading"
import { getTransactionIcon } from "@/app/_lib/db/constants";

import { getUserTransactionsByGroupIdService } from "@/app/_service/transactions";

import {
  Divider,
  Text,
  useDisclosure,
  ListItem,
  List,
  ListIcon,
  Flex,
  IconButton,
  Button,
} from "@chakra-ui/react"


function TransactionsList({ transactions, group, sessionData, setSelectedTransaction, onClick }:
  { transactions: GroupedTransactions, group: GroupWithMembers, sessionData: any, setSelectedTransaction: any, onClick: any}) {
  return (
    <>
    {transactions.map((yearData, index) => (
      <List w='100%' variant={'transaction'} key={index}>
        <Divider marginY={1} />
        <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'xs'} fontWeight={600} color={'whiteAlpha.800'}>{yearData.year}</Text>
        {yearData.data.map((monthData, index) => (
          <div key={index}>
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
                <SummaryDisplay transaction={transaction} users={group?.users!} userId={sessionData?.user?.id!} />
                <AmountDisplay transactionDetails={transaction.transactionDetails} userId={sessionData?.user?.id!} />
              </ListItem>
            ))}
          </div>
        ))}
      </List >
      ))}
    </>
  )
}



export default function TransactionsView({ group, transactions, firstCursor }: 
  { group: GroupWithMembers, transactions: GroupedTransactions, firstCursor: number})
{
  const { data: sessionData } = useSession();

  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails>();
  const [cursor, setCursor] = useState<number | undefined>(firstCursor);

  const { onClick, buttonProps } = getButtonProps();
  const disclosureProps = getDisclosureProps({
    transaction: selectedTransaction,
  });


  return (group == undefined || !sessionData?.user ? <Loading /> :
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text fontSize='lg' alignSelf={'center'} fontWeight='300' textAlign={'center'} zIndex={1}
        position={'sticky'} top={'-40px'}>{group?.name}</Text>
      <IconButton variant={'new'} size={'lg'}
          icon={<MdAdd />} 
          onClick={() => { setSelectedTransaction(undefined); onClick() }}
          {...buttonProps}>new</IconButton>
      <TransactionsList transactions={transactions} group={group} sessionData={sessionData} setSelectedTransaction={setSelectedTransaction} onClick={onClick}/>
      {isOpen &&
        <TransactionView
          {...{
            disclosureProps,
            isOpen, onCloseDrawer: onClose,
            group: group!,
            transactionWithDetails: selectedTransaction,
          }} />
      }
      <Button variant={'loadMore'}
        isDisabled={cursor === undefined}
        onClick={async () => {
          const trasactionsLatest = await getUserTransactionsByGroupIdService(group.id, cursor);
          if (!trasactionsLatest.success) {
            setCursor(undefined);
            return;
          }
          setCursor(trasactionsLatest.data?.cursor as number);
          // Merge the new transactions with the old ones
          trasactionsLatest.data?.groupedTransactions.forEach((yearData) => {
            const yearIndex = transactions.findIndex((yearDataOld) => yearDataOld.year === yearData.year);
            if (yearIndex === -1) {
              transactions.push(yearData);
            } else {
              yearData.data.forEach((monthData) => {
                const monthIndex = transactions[yearIndex].data.findIndex((monthDataOld) => monthDataOld.monthName === monthData.monthName);
                if (monthIndex === -1) {
                  transactions[yearIndex].data.push(monthData);
                } else {
                  transactions[yearIndex].data[monthIndex].data.push(...monthData.data);
                }
              });
            }
          }
          );
        }}>Load More</Button>
    </Flex>
  )
}