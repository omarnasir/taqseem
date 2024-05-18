'use client'
import React from "react"
import { useSession } from 'next-auth/react';

import {
  Text,
  ListItem,
  List,
  Flex,
  VStack,
  HStack,
  ListIcon,
} from "@chakra-ui/react"
import { type ActivitiesByUserId } from "@/app/_data/activities"
import Loading from "@/app/(site)/loading"
import { getTransactionIcon } from "@/app/_lib/db/constants";

const cardItemWidths = {
  date: '20%',
  icon: '7%',
  addedby: '43%',
  desc: '25%',
}


export default function ActivityView({ activities }: { activities: ActivitiesByUserId[] }) {
  const { data: sessionData } = useSession();

  return (activities == undefined || !sessionData?.user ? <Loading /> :
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text fontSize='lg' alignSelf={'center'} fontWeight='300' textAlign={'center'} zIndex={1}
        position={'sticky'} top={'-40px'}>Activity</Text>
      {activities.map((activity) => (
        <List w='100%' variant={'transaction'} key={activity.id}>
          <ListItem w='100%' key={activity.id}
            flexDirection={'row'} display={'flex'} justifyContent={'space-between'}>
            <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'xs'} fontWeight={600}
              width={cardItemWidths.date}
              color={'whiteAlpha.800'}>
              {new Date(activity.createdAt).toLocaleDateString('en-gb', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
            <ListIcon as={getTransactionIcon(activity.category)} width={cardItemWidths.icon} h='5' color='whiteAlpha.700' />
            <HStack w={cardItemWidths.addedby} alignItems='center' justifyContent='start'>
              <Text fontSize={'md'} color={'whiteAlpha.800'} letterSpacing={'tight'} fontWeight={'700'}>
                {activity.transactionDetails[0].user.id === activity.createdById ? 'You' : activity.transactionDetails[0].user.name}
              </Text>
              <Text fontSize={'md'} color={'whiteAlpha.700'} letterSpacing={'tight'} fontWeight={'400'}>
                added &quot;{activity.name}&quot;
              </Text>
            </HStack>
            <VStack w={cardItemWidths.desc} spacing={0} alignItems={'flex-end'}>
              <HStack>
                <Text color={activity.transactionDetails[0].amount >= 0 ? 'green.500' : 'red.500'}
                  fontSize={'lg'} letterSpacing={'tight'}>
                  {activity.transactionDetails[0].amount > 0 ? '+' : ''}{activity.transactionDetails[0].amount.toFixed(2)}</Text>
                <Text color={activity.transactionDetails[0].amount >= 0 ? 'green.500' : 'red.500'}>€</Text>
              </HStack>
              <Text fontSize={'2xs'}
                color={activity.transactionDetails[0].amount >= 0 ? 'green.400' : 'red.400'} opacity={0.65}
                fontWeight={'300'} letterSpacing={'tight'}>
                you {activity.transactionDetails[0].amount > 0 ? 'lent' : 'borrowed'}
              </Text>
            </VStack>
          </ListItem>
        </List>
      ))}
    </Flex>
  );
} 