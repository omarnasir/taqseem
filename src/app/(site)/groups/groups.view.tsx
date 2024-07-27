"use client";
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { useForm, FieldValues } from "react-hook-form"
import { createGroupAction, deleteGroupAction } from "@/server/actions/groups.action";

import { 
  Stack, 
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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";


import { MdPersonRemove, MdManageAccounts, MdGroups } from "react-icons/md"

import { type GroupData } from "@/types/groups.type";
import { CustomToast } from '@/components/toast';
import { Confirm } from '@/app/(site)/components/confirm';
import { useState } from 'react';
import MembershipsView from './memberships.view';

function CreateGroupDisclosure() {
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
      <Drawer isOpen={isOpen} onClose={onClose}
        variant={'add'}
        size={'sm'}
        placement='right'>
        <DrawerOverlay />
        <FormControl isInvalid={!!errors?.group}>
          <DrawerContent >
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading variant='h3'>Create a New Group</Heading>
            </DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleSubmit(onSubmit)}>
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
              </form>
              </DrawerBody>
          </DrawerContent>
        </FormControl>
      </Drawer>
    </>
  )
}

export default function GroupsView({ groups, sessionUserId }: {groups?: GroupData[], sessionUserId: string}) {
  const router = useRouter();

  const { isOpen, onClose, getDisclosureProps, getButtonProps } = useDisclosure();
  const [selectedGroup, setSelectedGroup] = useState<GroupData>();

  const { onClick } = getButtonProps();
  const disclosureProps = getDisclosureProps();

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
        <VStack alignItems={'flex-start'} w='80%'>
          <Heading variant={'h1'}>Groups</Heading>
          <Heading variant={'h3'}>Manage your groups.</Heading>
        </VStack>
        <CreateGroupDisclosure />
      </HStack>
      <SimpleGrid spacing={4} marginTop={4}>
        {groups &&
          groups.map((group) => (
            <Card key={group.id} size={'sm'} variant={'infoCard'}>
              <CardHeader>
                <HStack>
                  <MdGroups />
                  <Heading
                    as={NextLink} variant={'h2'}
                    href={`/groups/${group.id}/transactions`}>{group.name}</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
              <ButtonGroup isDisabled={group.createdById !== sessionUserId} justifyContent={'flex-end'}>
                <Button leftIcon={<MdManageAccounts />}
                  w='30%'
                  variant='settle'
                  onClick={(e) => router.push(`/groups/${group.id}/settle`)}>
                  Settle
                </Button>
                <Button leftIcon={<MdManageAccounts />}
                  w='30%'
                  variant="action"
                  onClick={() => { setSelectedGroup(group); onClick() }}>
                  Manage
                </Button>
                <Confirm callback={() => {
                  onRemoveGroup(group.id)
                }} mode="removeGroup" >
                  <Button leftIcon={<MdPersonRemove />}
                    w='30%'
                    variant="delete">
                    Remove
                  </Button>
                </Confirm>
              </ButtonGroup>
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
      {isOpen && selectedGroup &&
        <MembershipsView
          {...{
            disclosureProps,
            isOpen, onCloseDrawer: onClose,
            group: selectedGroup,
            sessionUserId: sessionUserId,
          }} />
      }
    </Stack>
  )
}
