"use client";
import { Skeleton, SkeletonCircle, SkeletonText, VStack } from "@chakra-ui/react";


export default function Loading() {
  return (
    <VStack>
      {[...Array(10)].map((_, i) =>
        <SkeletonText key={i} mt="4" noOfLines={4} spacing="4" />
      )}
    </VStack>
  )
}