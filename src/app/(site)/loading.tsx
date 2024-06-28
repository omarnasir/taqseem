"use client";
import { AbsoluteCenter, Flex, Heading, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <AbsoluteCenter>
      <Flex direction='row' align='center' justify='center'>
        <Spinner size='lg' mr={4} />
        <Heading size={'md'}>Loading</Heading>
      </Flex>
    </AbsoluteCenter>
  )
}