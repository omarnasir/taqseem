'use client'
import React from "react"

import {
  Text,
  ListItem,
  List,
  Flex,
  VStack,
  HStack,
  ListIcon,
  Button,
  Divider,
  Heading,
} from "@chakra-ui/react"
import { ActivityService, type ActivityWithDetails } from '@/types/activities.type';
import { ActivityTypeEnum, getTransactionIcon } from "@/lib/db/constants";

import { GroupData } from "@/types/groups.type";

import { useGetUserActivity } from "@/client/hooks/activities.hook";

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
        <Text variant={'activityCreatedBy'} >
          {activity.createdById === userId ? 'You' : activity.createdBy?.name}
        </Text>
        <Text variant={'activityDescription'}>{action}{' '}{transactionName}{' in '}{activity.group?.name}{'.'}
        </Text>
      </HStack>
      <HStack>
        {!activity.isInvolved ?
          <Text variant={'activityUserStatus'}>
            You are not involved</Text> :
            <Text variant={activity.transaction.paidById === userId ? 'activityLent' : 'activityBorrowed'}>
              You{' '}{activity.transaction.paidById === userId ? (activity.transaction.isSettlement ? 'paid' : 'lent') :(activity.transaction.isSettlement ? 'get back' : 'borrowed')}{' '}
              {Math.abs(activity.amount).toFixed(2)}{' '}€</Text>}
      </HStack>
    </VStack>
  )
}

export default function ActivityView({ userGroups, activitiesInitialData, sessionData }: 
  { userGroups: GroupData[], activitiesInitialData: ActivityService, sessionData: any}) 
{
  const { data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
   } = useGetUserActivity(sessionData.user?.id as string, userGroups.map(group => group.id), activitiesInitialData);

  return (
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Heading variant={'h1Center'}>Activity</Heading>
      <Divider marginY={7}/>
      <List w='100%' variant={'activity'}>
        {data.pages.map((page) => (
          page.activities.map((activity) => (
            <ListItem w='100%' key={activity.id}>
              <ListIcon as={getTransactionIcon(activity.transaction.category)} width={cardItemWidths.icon} h='5' color='whiteAlpha.700' />
              <ActivitySummary activity={activity} userId={sessionData.user?.id as string} />
              <Text variant={'listSupplementary'} width={cardItemWidths.date}>
                {relativeTimeAgo(new Date(activity.createdAt))}
              </Text>
            </ListItem>
          ))
        ))}
      </List>
      <Button variant={'loadMore'}
        isDisabled={!hasNextPage}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}>Load More</Button>
    </Flex>
  );
} 