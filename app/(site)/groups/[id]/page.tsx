'use client'
import React, { useEffect, useState } from "react"

import Add from "./_components/add"
import TransactionsList from "./_components/list"
import { GroupWithMembers } from "@/app/_types/model/groups"
import { getGroupDetails } from "@/app/(site)/groups/_lib/group-service"
import Loading from "@/app/(site)/loading"
import { 
  Divider, 
  HStack, 
  IconButton, 
  VStack, 
  Text,
  useDisclosure
 } from "@chakra-ui/react"

import { MdAdd } from "react-icons/md"


export default function GroupDetail({ params }: 
  { params: { id: string } }) 
{
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<GroupWithMembers>();
  const [refreshTransactions, setRefreshTransactions] = useState<string>('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      await getGroupDetails(params.id).then((res) => {
        setGroup(res.data);
        setLoading(false);
      });
    }
    fetchGroupDetails();
  }, [params.id]);

  return (
    loading ? <Loading /> :
      <VStack w='100%'>
        <HStack w='100%' justifyContent={'space-between'}>
          <Text fontSize='xl' fontWeight='bold'>{group?.name}</Text>
          <Text fontSize='md' fontWeight='400'>Transactions</Text>
          <IconButton size={'md'} borderRadius={'full'}
            icon={<MdAdd />} aria-label="Add transaction"
            onClick={onOpen} />
        </HStack>
        <Divider marginY={2} />
        <Add {...{ group: group!, onClose, isOpen, setRefreshTransactions }} />
        <TransactionsList {...{group: group!, refreshTransactions, setRefreshTransactions}} />
      </VStack>
  )
}