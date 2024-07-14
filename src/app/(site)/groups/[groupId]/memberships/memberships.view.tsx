'use client'
import { useRouter } from "next/navigation";

import { FieldValues, useForm } from "react-hook-form";

import {
  Stack,
  Button,
  Text,
  useDisclosure,
  SimpleGrid,
  Heading,
  VStack,
  FormControl,
  FormErrorMessage,
  Input,
  HStack,
  FormLabel,
  List,
  ListItem,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { MdPerson, MdPersonRemove } from 'react-icons/md'

import { CustomToast } from "@/components/toast";
import { Confirm } from "@/app/(site)/components/confirm";

import { createMembershipAction, deleteMembershipAction } from "@/server/actions/memberships.action";
import { GroupData } from "@/types/groups.type";
import { UserBasicData } from "@/types/users.type";

import { useGetUserGroups } from "@/client/hooks/groups.hook";
import { useGetGroupMemberships } from "@/client/hooks/memberships.hook";

function AddMemberModal(group: GroupData) {
  const router = useRouter();
  const { addToast } = CustomToast();

  const { isOpen, onClose, onOpen } = useDisclosure()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createMembershipAction({
      groupId: group.id,
      userEmail: values.email
    });
    if (response.success) {
      addToast("User added", `${values.email} was added to group ${group.name}`, "success")
      reset()
      router.refresh()
      onClose();
    }
    else {
      addToast("Error adding member", response.error, "error")
    }
  }

  return (
    <>
      <Button w='40%' variant={'add'} onClick={onOpen}>Add Member</Button>
      <Modal isOpen={isOpen} onClose={onClose} variant={'create'}>
        <ModalOverlay />
        <FormControl isInvalid={!!errors?.email}>
          <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add a new Member</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Input
                size={'sm'}
                marginRight={3}
                rounded={'md'}
                id='email'
                variant='outline'
                placeholder='Enter user email'
                {...register('email', {
                  required: 'This is required',
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: 'Invalid email address',
                  },
                })}
              />
            </ModalBody>
            <ModalFooter>
              <Button w='50%' isLoading={isSubmitting} type='submit'
                fontSize={'xs'}
                size='sm' variant={"add"}>
                Add User
              </Button>
              {errors?.email &&
                <FormErrorMessage alignSelf={'flex-start'}>
                  {errors.email.message?.toString()}
                </FormErrorMessage>
              }
            </ModalFooter>
          </ModalContent>
        </FormControl>
      </Modal>
    </>
  )
}

export default function MembershipsView({ membershipsInitialData,  groupsInitialData, groupId, sessionUserId }:
   { membershipsInitialData?: UserBasicData[], groupsInitialData?: GroupData[], groupId: string, sessionUserId: string }
) {
  const router = useRouter();
  const { addToast } = CustomToast()

  const groups = useGetUserGroups(sessionUserId, groupsInitialData)
  const memberships = useGetGroupMemberships(groupId, membershipsInitialData)
  
  const group = groups?.find((g: GroupData) => g.id === groupId) as GroupData;

  async function onRemoveUser(userId: string) {
    const res = await deleteMembershipAction({groupId: group.id, userId: userId})
    if (res.success) {
      addToast('User removed from group', null, 'success')
      router.refresh()
    }
    else {
      addToast('Error removing user from group', res.error, 'error')
    }
  }

  return (group &&
    <Stack direction={'column'} spacing={4} display={'flex'}>
      <HStack w='100%'>
        <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }} w='70%'>
          <Text variant='h1'>{group.name}</Text>
          <Text variant='h2'>Add or remove members.</Text>
        </VStack>
        <AddMemberModal {...group} />
      </HStack>
      <SimpleGrid spacing={1}>
        <List w='100%' variant={'members'}>
          {!!memberships ? memberships.map((member) => (
            <ListItem w='100%' key={member.id}>
              <MdPerson width={'20%'}/>
              <Heading width={'50%'}
                fontSize={'md'}
                fontWeight={400}>{member.name}</Heading>
                <HStack w='30%'>
                <Confirm callback={() => {
                  onRemoveUser(member.id);
                }} mode="removeUser">
                  <Button leftIcon={<MdPersonRemove />}
                    w='100%'
                    isDisabled={!(group.createdById === sessionUserId ||
                      member.id === sessionUserId)}
                    variant={'delete'}>
                    Remove
                  </Button>
                </Confirm>
              </HStack>
            </ListItem>
          )) : <Text>No members</Text>}
        </List>
      </SimpleGrid>
    </Stack>
  )
}