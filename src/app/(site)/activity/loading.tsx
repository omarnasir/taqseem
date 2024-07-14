"use client";
import { Skeleton, Stack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Stack spacing={8} mt={'10vh'}>
      {[...Array(8)].map((_, index) => (
        <Skeleton height='50px' key={index} />
      ))}
    </Stack>
  )
}