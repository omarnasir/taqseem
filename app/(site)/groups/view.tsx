"use client";
import NextLink from 'next/link'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

import { useForm, FieldValues } from "react-hook-form"
import { createGroupAction} from "@/app/_actions/groups";

import { 
  Stack, 
  Text, 
  VStack ,
  Card,
  CardBody,
  Heading,
  Button, 
  SimpleGrid, 
  ButtonGroup,
  useDisclosure,
  UseDisclosureReturn,
  CardHeader,
  FormControl,
  FormErrorMessage,
  Input,
  HStack,
  FormLabel,
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

import { MdPersonRemove, MdManageAccounts, MdGroups } from "react-icons/md"

import { type GroupData } from "@/app/_types/model/groups";
import { deleteGroupAction } from '@/app/_actions/groups';
import { CustomToast } from '@/app/_components/toast';
import Confirm from '@/app/(site)/_components/confirm';


function CreateGroupModal(createGroupProps: UseDisclosureReturn) {
  const router = useRouter();
  const { addToast } = CustomToast();

  const { isOpen, onClose } = createGroupProps;
  
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()


  async function onSubmit(values: FieldValues) {
    const response = await createGroupAction(values.name);
    if (response.success) {
      router.refresh()
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={'create'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody as='form'onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors?.group}>
            <FormLabel htmlFor='name'>Name</FormLabel>
            <Input
              id='name'
              size={'sm'}
              marginRight={3}
              rounded={'md'}
              placeholder='Name of your group'
              {...register('name', {
                required: 'This is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters long',
                }
              })}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button w='40%' isLoading={isSubmitting} type='submit'
            fontSize={'xs'}
            size='sm' variant={"add"}>
            Create Group
          </Button>
          {errors?.group &&
            <FormErrorMessage >
              {errors.group.message?.toString()}
            </FormErrorMessage>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default function GroupsView({ groups }: {groups: GroupData[]}) {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const createGroupProps = useDisclosure()
  const removeGroupProps = useDisclosure()
  const { addToast } = CustomToast();

  async function onRemoveGroup(id: string) {
    const res = await deleteGroupAction(id);
    if (res.success) {
      const groupName = groups.find(g => g.id === id)?.name
      addToast(`Group ${groupName} removed`, null, 'success')
      router.refresh()
    }
    else {
      addToast('Cannot delete group.', res.error, 'error')
    }
  }

  return (
    <Stack direction={'column'} spacing={4} display={'flex'}>
      <HStack w='100%'>
        <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }} w='70%'>
          <Text fontSize='2xl' fontWeight='300'>Groups</Text>
          <Text fontSize='sm' fontWeight='200' letterSpacing={'normal'}>Manage your groups.</Text>
        </VStack>
        <Button w='30%' variant={'add'} onClick={createGroupProps.onOpen}>Create</Button>
        <CreateGroupModal {...createGroupProps} />
      </HStack>
      <SimpleGrid spacing={1}>
        {!!groups &&
          groups.map((group) => (
            <Card key={group.id}
              size={'sm'}
              variant={'infoCard'}>
              <CardHeader>
                <HStack>
                  <MdGroups />
                  <Heading
                    as={NextLink}
                    href={`/groups/${group.id}/transactions`}
                    fontSize={'lg'} letterSpacing={'wide'}
                    fontWeight={300}>{group.name}</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                {group.createdById === sessionData?.user?.id &&
                  <ButtonGroup>
                    <Button leftIcon={<MdManageAccounts />}
                      w='100%'
                      variant="action"
                      onClick={() => router.push(
                        `/groups/${group.id}/memberships?data=${JSON.stringify(group)}`,)}>
                      Manage
                    </Button>
                    <Button leftIcon={<MdPersonRemove />}
                      w='100%'
                      variant="delete"
                      onClick={removeGroupProps.onOpen}>
                      Remove
                    </Button>
                    <Confirm isOpen={removeGroupProps.isOpen} onClose={removeGroupProps.onClose} callback={() => {
                      onRemoveGroup(group.id); removeGroupProps.onClose();
                    }} mode="removeGroup" />
                  </ButtonGroup>
                }
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
    </Stack>
  )
}
