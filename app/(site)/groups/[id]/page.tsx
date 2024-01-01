'use client'
import React from "react"
import { useSearchParams } from "next/navigation"
import { Button, useDisclosure } from "@chakra-ui/react"

import { AddItem } from "@/components/transactions/add-item"


export default function GroupDetail({ params }: 
  { params: { id: string } }) 
{
  const name = (useSearchParams().get('name')!)
  console.log(params.id, name)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Button onClick={onOpen}>Open Modal</Button>
      <AddItem isOpen={isOpen} onClose={onClose} />
      <h1>Group Detail</h1>
    </div>
  )
}