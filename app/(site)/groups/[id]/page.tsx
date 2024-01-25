'use client'
import React, { useEffect, useState } from "react"

import { Add } from "./_components/add"
import TransactionsList from "./_components/list"
import { GroupWithMembers } from "@/types/model/groups"
import { getGroupDetails } from "@/client/services/group-service"
import Loading from "@/app/(site)/loading"


export default function GroupDetail({ params }: 
  { params: { id: string } }) 
{
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<GroupWithMembers>();

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
    <>
      <Add group={group!} />
      <TransactionsList group={group!} />
    </>
  )
}