'use client'
import { useSearchParams } from "next/navigation"

import GroupAccordian from "@/components/groups/details"
import { GroupData } from "@/types/model/groups"

export default function GroupPage() {
  // get params from route query
  const id = useSearchParams().get('id')
  const name = useSearchParams().get('name')
  return (
    <GroupAccordian id={id!} name={name!} />
  )
}