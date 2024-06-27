"use client";
import NextLink from 'next/link'
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
  CardHeader,
  FormControl,
  useDisclosure,
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
import { Confirm } from '@/app/(site)/_components/confirm';


function CreateGroupModal() {
  const router = useRouter();
  const { addToast } = CustomToast();

  const { isOpen, onClose, onOpen } = useDisclosure()
  
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createGroupAction(values.name);

    if (response.success) {
      router.refresh()
      onClose();
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    <>
      <Button w='30%' variant={'add'} onClick={onOpen}>Create</Button>
      <Modal isOpen={isOpen} onClose={onClose} variant={'create'}>
        <ModalOverlay />
        <FormControl isInvalid={!!errors?.group}>
          <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create a New Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
        </FormControl>
      </Modal>
    </>
  )
}

export default function GroupsView({ groups, sessionUserId }: {groups?: GroupData[], sessionUserId: string}) {
  const router = useRouter();

  const { addToast } = CustomToast();

  async function onRemoveGroup(id: string) {
    const res = await deleteGroupAction(id);
    if (res.success) {
      const groupName = groups?.find(g => g.id === id)?.name
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
        <CreateGroupModal />
      </HStack>
      <SimpleGrid spacing={4}>
        {groups &&
          groups.map((group) => (
            <Card key={group.id}
              size={'sm'}
              variant={'infoCard'}>
              <CardHeader>
                <HStack>
                  <MdGroups />
                  <Heading
                    as={NextLink} marginLeft={2}
                    href={`/groups/${group.id}/transactions`}
                    fontSize={'lg'} letterSpacing={'wide'}
                    fontWeight={300}>{group.name}</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                {group.createdById === sessionUserId &&
                  <ButtonGroup>
                    <Button leftIcon={<MdManageAccounts />}
                      w='100%'
                      variant="action"
                      onClick={() => router.push(
                        `/groups/${group.id}/memberships?data=${JSON.stringify(group)}`,)}>
                      Manage
                    </Button>
                    <Confirm callback={() => {
                      onRemoveGroup(group.id)
                    }} mode="removeGroup" >
                      <Button leftIcon={<MdPersonRemove />}
                        w='100%'
                        variant="delete">
                        Remove
                      </Button>
                    </Confirm>
                  </ButtonGroup>
                }
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
    </Stack>
  )
}
