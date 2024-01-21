'use client'
import React, { useEffect, useState } from "react"

import { Add } from "@/components/transactions/add"
import { GroupWithMembers } from "@/types/model/groups"
import { getGroupDetails } from "@/client/services/group-service"
import Loading from "@/app/(site)/loading"


export default function GroupDetail({ params }: 
  { params: { id: string } }) 
{
  const [loading, setLoading] = useState<boolean>(true);
  const [groupDetail, setGroupDetail] = useState<GroupWithMembers>();

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
    <>
      <Add groupDetail={groupDetail!} />
    </>
  )
}