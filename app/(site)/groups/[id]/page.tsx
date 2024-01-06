'use client'
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button, useDisclosure } from "@chakra-ui/react"

import { Add } from "@/components/transactions/add"
import { GroupWithMembers } from "@/types/model/groups"
import { getGroupDetails } from "@/client/services/group-service"
import Loading from "@/app/(site)/loading"


export default function GroupDetail({ params }: 
  { params: { id: string } }) 
{
  const name = (useSearchParams().get('name')!)
  const [loading, setLoading] = useState<boolean>(true);
  const [groupDetail, setGroupDetail] = useState<GroupWithMembers>();
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const fetchGroupDetails = async () => {
      await getGroupDetails(params.id).then((res) => {
        setGroupDetail(res.data);
        setLoading(false);
      });
    }
    fetchGroupDetails();
  }, [params.id]);

  return (
    loading ? <Loading /> :
    <div>
      <Button onClick={onOpen}>Open Modal</Button>
      <Add isOpen={isOpen} onClose={onClose} groupDetail={groupDetail!} />
      <h1>Group Detail: {name}</h1>
    </div>
  )
}