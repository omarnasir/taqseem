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
  icon: '8%',
  desc: '77%',
  date: '15%',
}


function relativeTimeAgo(date: Date) {
  const diff = new Date(
    new Date().getTime() - date.getTime()
  );
  const hours = diff.getUTCHours();
  const minutes = diff.getUTCMinutes();
  const days = diff.getUTCDate() - 1;
  const months = diff.getUTCMonth();
  const years = diff.getUTCFullYear() - 1970;

  if (years > 0) {
    return years + ' year' + (years > 1 ? 's' : '');
  }
  if (months > 0) {
    return months + ' month' + (months > 1 ? 's' : '');
  }
  if (days > 0) {
    return days + ' day' + (days > 1 ? 's' : '');
  }
  if (hours > 0) {
    return hours + ' hour' + (hours > 1 ? 's' : '');
  }
  if (minutes > 0) {
    return minutes + ' minute' + (minutes > 1 ? 's' : '');
  }
  return 'just now';
}

export default function ActivityView({ activities }: { activities: ActivitiesByUserId[] }) {
  const { data: sessionData } = useSession();

  return (activities == undefined || !sessionData?.user ? <Loading /> :
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text fontSize='lg' alignSelf={'center'} fontWeight='300' textAlign={'center'} zIndex={1}
        position={'sticky'} top={'-40px'}>Activity</Text>
      {activities.map((activity) => (
        <List w='100%' variant={'activity'} key={activity.id}>
          <ListItem w='100%' key={activity.id}
            flexDirection={'row'} display={'flex'} justifyContent={'space-between'}>
            {/* <Text textAlign={'center'} letterSpacing={'wide'} fontSize={'xs'} fontWeight={600}
              width={cardItemWidths.date}
              color={'whiteAlpha.800'}>
              {new Date(activity.createdAt).toLocaleDateString('en-gb', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text> */}
            <ListIcon as={getTransactionIcon(activity.category)} width={cardItemWidths.icon} h='5' color='whiteAlpha.700' />
            <VStack w={cardItemWidths.desc} alignItems='start' ml={1}>
              <HStack >
                <Text fontSize={'sm'} color={'whiteAlpha.900'} letterSpacing={'tight'} fontWeight={'700'}>
                  {activity.transactionDetails[0].user.id === activity.createdById ? 'You' : activity.transactionDetails[0].user.name}
                </Text>
                <Text fontSize={'sm'} color={'whiteAlpha.800'} letterSpacing={'tight'} fontWeight={'400'}>{' '}added{' '}&quot;{activity.name}&quot;
                </Text>
              </HStack>
              <HStack spacing={0}>
                <Text fontSize={'xs'}
                  color={activity.transactionDetails[0].amount >= 0 ? 'green.400' : 'red.400'} opacity={0.8}
                  fontWeight={'400'} letterSpacing={'tight'}>
                  you{' '}{activity.transactionDetails[0].amount > 0 ? 'lent' : 'borrowed'}{' '}
                  {activity.transactionDetails[0].amount > 0 ? '+' : ''}{activity.transactionDetails[0].amount.toFixed(2)}{' '}€</Text>
              </HStack>
            </VStack>
            <Text textAlign={'end'} letterSpacing={'tight'} fontSize={'2xs'} fontWeight={200}
              width={cardItemWidths.date} color={'whiteAlpha.800'}>
              {relativeTimeAgo(new Date(activity.createdAt))}
            </Text>
          </ListItem>
        </List>
      ))}
    </Flex>
  );
} 