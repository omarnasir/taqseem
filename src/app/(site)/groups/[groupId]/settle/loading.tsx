'use client';
import { Skeleton, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <VStack>
      <Skeleton height={'25vh'} width={'100%'} />
      <Skeleton height={'25vh'} width={'100%'} />
    </VStack>
  )
}