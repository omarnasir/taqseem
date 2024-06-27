'use client'
import React, { useState } from "react"

import {
  Text,
  ListItem,
  List,
  Flex,
  VStack,
  HStack,
  ListIcon,
  Button,
} from "@chakra-ui/react"
import { type ActivityWithDetails } from '@/app/_types/model/activities';
import { ActivityTypeEnum, getTransactionIcon } from "@/app/_lib/db/constants";
import { getActivityService } from "@/app/_service/activities";
import { GroupData } from "@/app/_types/model/groups";
import { useQueryClient } from "@tanstack/react-query";

const cardItemWidths = {
  icon: '7%',
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
    return minutes + ' min' + (minutes > 1 ? 's' : '');
  }
  return 'just now';
}


function ActivitySummary({ activity, userId }: { activity: ActivityWithDetails, userId: string }) {
  const action = (activity.action === ActivityTypeEnum.CREATE ? 'added' : 'updated') + ` ${activity.transaction.isSettlement ? 'a settlement' : ''}`;
  const transactionName = activity.transaction.isSettlement ? '' : `'${activity.transaction.name}'`;

  return (
    <VStack w={cardItemWidths.desc} alignItems='start' ml={1}>
      <HStack spacing={1}>
        <Text fontSize={'sm'} color={'whiteAlpha.900'} letterSpacing={'tight'} fontWeight={'700'}>
          {activity.createdById === userId ? 'You' : activity.createdBy?.name}
        </Text>
        <Text fontSize={'xs'} color={'whiteAlpha.800'} letterSpacing={'tight'} fontWeight={'400'}>{action}{' '}{transactionName}{' in '}{activity.transaction.group?.name}{'.'}
        </Text>
      </HStack>
      <HStack>
        {!activity.isInvolved ?
          <Text fontSize={'xs'} color={'whiteAlpha.600'} opacity={0.8} fontWeight={'400'} letterSpacing={'tight'}>
            You are not involved</Text> :
            <Text fontSize={'xs'} color={activity.transaction.paidById === userId ? 'green.400' : 'red.400'} opacity={0.8} fontWeight={'500'} letterSpacing={'tight'}>
              You{' '}{activity.transaction.paidById === userId ? (activity.transaction.isSettlement ? 'paid' : 'lent') :(activity.transaction.isSettlement ? 'get back' : 'borrowed')}{' '}
              {Math.abs(activity.amount).toFixed(2)}{' '}€</Text>}
      </HStack>
    </VStack>
  )
}

export default function ActivityView({ userGroups, activities, firstCursor, sessionData }: { userGroups: GroupData[], activities: ActivityWithDetails[], firstCursor: number, sessionData: any}) {
  const queryClient = useQueryClient();
  queryClient.setQueryData(['activities', sessionData.user?.id], activities);

  const [cursor, setCursor] = useState<number | undefined>(firstCursor);

  return (
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text fontSize='lg' alignSelf={'center'} fontWeight='300' textAlign={'center'} zIndex={1}
        position={'sticky'} top={'-40px'}>Activity</Text>
      {activities.map((activity) => (
        <List w='100%' variant={'activity'} key={activity.id}>
          <ListItem w='100%' key={activity.id}
            flexDirection={'row'} display={'flex'} justifyContent={'space-between'}>
            <ListIcon as={getTransactionIcon(activity.transaction.category)} width={cardItemWidths.icon} h='5' color='whiteAlpha.700' />
            <ActivitySummary activity={activity} userId={sessionData.user?.id as string} />
            <Text textAlign={'end'} letterSpacing={'tighter'} fontSize={'xs'} fontWeight={300}
              width={cardItemWidths.date} color={'whiteAlpha.700'}>
              {relativeTimeAgo(new Date(activity.createdAt))}
            </Text>
          </ListItem>
        </List>
      ))}
      <Button variant={'loadMore'}
        isDisabled={cursor === undefined}
        onClick={async () => {
          const activitiesLatest = await queryClient.fetchQuery(
          {
            queryKey: ['activities', sessionData.user?.id],
            queryFn: () => getActivityService(userGroups.map(group => group.id), cursor), 
            staleTime: 100
          });
          if (!activitiesLatest.success) {
            setCursor(undefined);
            return;
          }
          setCursor(activitiesLatest.data?.cursor as number);
          activities.push(...activitiesLatest.data?.activities ?? []);
        }}>Load More</Button>
    </Flex>
  );
} 