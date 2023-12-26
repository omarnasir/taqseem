'use client'
import {
  Heading,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  HStack,
  Button,
  Box,
} from "@chakra-ui/react";

import { useForm, FieldValues } from "react-hook-form"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import GroupContainer from "@/components/groups/container";
import { createGroup } from "@/client/services/group-service";
import {
  getAllGroupsByCreatedId,
  getAllGroupsByUserId
} from "@/client/services/group-service";

import { type GroupData } from "@/types/model/groups";
import { CustomToast } from "@/components/ui/toast";
import Loading from "../loading";


async function getAllGroupsData(id: string)
  : Promise<{ ownedGroups: GroupData[], groups: GroupData[] }> {
  const data = {
    ownedGroups: [],
    groups: []
  }
  await getAllGroupsByCreatedId(id).then((res) => {
    if (res.success) {
      if (res.data) data.ownedGroups = res.data;
    }
  })
  await getAllGroupsByUserId(id).then((res) => {
    if (res.success) {
      if (res.data) data.groups = res.data;
    }
  })
  return data;
}

export default function GroupsPage() {
  const { data } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [ownedGroups, setOwnedGroups] = useState<GroupData[]>([]);

  const { addToast } = CustomToast();

  useEffect(() => {
    if (data) {
      const fetchGroups = async () => {
        await getAllGroupsData(data.user.id).then((data) => {
          setGroups(data.groups);
          setOwnedGroups(data.ownedGroups);
        });
      }
      fetchGroups();
      setLoading(false);
    }
  }, [data]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createGroup({
      id: data.user.id,
      name: values.name,
    })
    if (response.success) {
      setGroups([...groups, response.data!]);
      setOwnedGroups([...ownedGroups, response.data!]);
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    loading ? <Loading /> :
      <Flex direction={'column'} w='inherit'>
        <GroupContainer {...{ groups: ownedGroups , title: 'Your Groups' }} />
        <GroupContainer {...{ groups: groups , title: 'Groups you are part of' }} />
        <Box p={1}>
          <Heading marginX={4} size='md' fontWeight='light'>Create a new Group</Heading>
          <HStack mt={4}
            as='form'
            flexDirection={'row'}
            alignContent={'center'}
            justifyContent={'center'}
            onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors?.group}>
              <Input
                id='name'
                variant='outline'
                placeholder='Name of your group'
                {...register('name', {
                  required: 'This is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters long',
                  }
                })}

              />
              {errors?.group &&
                <FormErrorMessage >
                  {errors.group.message?.toString()}
                </FormErrorMessage>
              }
            </FormControl>
            <Button
              w='50%'
              bg={'gray.100'}
              colorScheme='loginbtn'
              textColor='green.900'
              isLoading={isSubmitting}
              type='submit'>
              Create
            </Button>
          </HStack>
        </Box>
      </Flex>
    );
}