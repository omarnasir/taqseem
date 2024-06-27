'use client'
import { useRouter } from "next/navigation";
import { useSessionHook } from '@/app/_hooks/use-current-user';

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

import { CustomToast } from "@/app/_components/toast";
import { Confirm } from "@/app/(site)/_components/confirm";

import { createMembershipAction } from "@/app/_actions/memberships";

import { GroupData } from "@/app/_types/model/groups";
import { UserBasicData } from "@/app/_types/model/users";


import { deleteMembershipAction } from "@/app/_actions/memberships";


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
      <Button w='30%' variant={'add'} onClick={onOpen}>Add Members</Button>
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

export default function MembershipsView({ group, memberships }:
   { group: GroupData, memberships: UserBasicData[] }
) {
  const router = useRouter();
  const { session, status } = useSessionHook();

  const { addToast } = CustomToast()

  async function onRemoveUser(userId: string) {
    const res = await deleteMembershipAction(group.id, userId)
    if (res.success) {
      addToast('User removed from group', null, 'success')
      router.refresh()
    }
    else {
      addToast('Error removing user from group', res.error, 'error')
    }
  }

  return (status === 'authenticated' &&
    <Stack direction={'column'} spacing={4} display={'flex'}>
      <HStack w='100%'>
        <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }} w='70%'>
          <Text fontSize='lg' fontWeight='500'>{group.name}</Text>
          <Text fontSize='sm' fontWeight='300'>Add or remove members.</Text>
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
              {(group.createdById === session?.user?.id ||
                member.id === session?.user?.id) &&
                <HStack w='30%'>
                  <Confirm callback={() => {
                    onRemoveUser(member.id);
                  }} mode="removeUser">
                    <Button leftIcon={<MdPersonRemove />}
                      w='100%'
                      variant={'delete'}>
                      Remove
                    </Button>
                  </Confirm>
                </HStack>
              }
            </ListItem>
          )) : <Text>No members</Text>}
        </List>
      </SimpleGrid>
    </Stack>
  )
}