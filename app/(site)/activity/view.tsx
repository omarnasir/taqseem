'use client'
import React, { useMemo, useState } from "react"
import { useSession } from 'next-auth/react';

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
import Loading from "@/app/(site)/loading"
import { ActivityTypeEnum, getTransactionIcon } from "@/app/_lib/db/constants";
import { getActivityService } from "@/app/_service/activities";
import { GroupData } from "@/app/_types/model/groups";

const cardItemWidths = {
  icon: '8%',
  desc: '72%',
  date: '20%',
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
  const action = activity.transaction.isSettlement ? 'settled' : activity.action === ActivityTypeEnum.CREATE ? 'added' : 'updated';
  // const transactionName = 
  return (
    <VStack w={cardItemWidths.desc} alignItems='start' ml={1}>
      <HStack >
        <Text fontSize={'sm'} color={'whiteAlpha.900'} letterSpacing={'tight'} fontWeight={'700'}>
          {activity.createdById === userId ? 'You' : activity.createdBy?.name}
        </Text>
        <Text fontSize={'sm'} color={'whiteAlpha.800'} letterSpacing={'tight'} fontWeight={'400'}>{' '}{action}{' '}&quot;{activity.transaction.name}&quot;
        </Text>
      </HStack>
      {/* <HStack spacing={0}>
        <Text fontSize={'xs'}
          color={userActivity?.amount! >= 0 ? 'green.400' : 'red.400'} opacity={0.8}
          fontWeight={'400'} letterSpacing={'tight'}>
          you{' '}{userActivity?.amount! > 0 ? 'lent' : 'borrowed'}{' '}
          {Math.abs(userActivity?.amount!).toFixed(2)}{' '}€</Text>
      </HStack> */}
    </VStack>
  )
}

function ActivitiesList({ activities, userId }: { activities: ActivityWithDetails[], userId: string}) {

  return (
    <>
      {activities.map((activity) => (
        <List w='100%' variant={'activity'} key={activity.id}>
          <ListItem w='100%' key={activity.id}
            flexDirection={'row'} display={'flex'} justifyContent={'space-between'}>
            <ListIcon as={getTransactionIcon(activity.transaction.category)} width={cardItemWidths.icon} h='5' color='whiteAlpha.700' />
            <ActivitySummary activity={activity} userId={userId} />
            <Text textAlign={'end'} letterSpacing={'tighter'} fontSize={'xs'} fontWeight={300}
              width={cardItemWidths.date} color={'whiteAlpha.700'}>
              {relativeTimeAgo(new Date(activity.createdAt))}
            </Text>
          </ListItem>
        </List>
      ))}
    </>
  )
}


export default function ActivityView({ userGroups, activities, firstCursor }: { userGroups: GroupData[], activities: ActivityWithDetails[], firstCursor: number}) {
  const { data: sessionData } = useSession();
  const [cursor, setCursor] = useState<number | undefined>(firstCursor);

  
  return (activities == undefined || !sessionData?.user ? <Loading /> :
    <Flex w='100%' direction={'column'} paddingBottom={20} paddingTop={5}>
      <Text fontSize='lg' alignSelf={'center'} fontWeight='300' textAlign={'center'} zIndex={1}
        position={'sticky'} top={'-40px'}>Activity</Text>
      <ActivitiesList activities={activities} userId={sessionData?.user?.id!} />
      <Button variant={'loadMore'}
        isDisabled={cursor === undefined}
        onClick={async () => {
          const activitiesLatest = await getActivityService(userGroups.map(group => group.id), cursor);
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