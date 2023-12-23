'use client'
import {
  Heading,
  Flex,
  FormControl,
  FormErrorMessage,
  Input, 
  HStack, 
  Button
} from "@chakra-ui/react";

import { useForm, FieldValues } from "react-hook-form"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import GroupsTable from "@/components/groups/table";
import { createGroup } from "@/client/services/groupService";
import { 
  getAllGroupsByCreatedId,
  getAllGroupsByUserId
 } from "@/client/services/groupService";

import { type GroupData } from "@/types/groups";
import { CustomToast } from "@/components/ui/toast";

export default function GroupsPage() {
  const { data } = useSession();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [ownedGroups, setOwnedGroups] = useState<GroupData[]>([]);

  const { addToast } = CustomToast();

  useEffect(() => {
    if (data) {
      const fetchGroups = async () => {
        await getAllGroupsByCreatedId(data.user.id).then(res => {
          if (res.success) {
            if (res.groups) setOwnedGroups(res.groups);
          }
        }),
        await getAllGroupsByUserId(data.user.id).then(res => {
            if (res.success) {
              if (res.groups) setGroups(res.groups);
            }
        })
      }
      fetchGroups();
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
      setGroups([...groups, response.group!]);
      setOwnedGroups([...ownedGroups, response.group!]);
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    <Flex direction={'column'} w='inherit'>
      <Heading
        alignSelf={'flex-start'} size='md' fontWeight='light'>Your Groups</Heading>
      <GroupsTable {...{ groups: ownedGroups }} />
      <Heading pt={6}
        alignSelf={'flex-start'} size='md' fontWeight='light'>Groups you are part of</Heading>
      <GroupsTable {...{ groups: groups }} />
      <Heading pt={6}
        alignSelf={'flex-start'} size='md' fontWeight='light'>Create a new Group</Heading>
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
    </Flex>
  );
}