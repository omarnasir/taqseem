"use client";
import NextLink from 'next/link'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

import { useForm, FieldValues } from "react-hook-form"
import { createGroupAction} from "@/app/_actions/groups";

import { 
  Divider, 
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
  CardHeader,
  FormControl,
  FormErrorMessage,
  Input
} from "@chakra-ui/react";
import { MdPersonRemove, MdManageAccounts, MdGroups } from "react-icons/md"

import { type GroupData } from "@/app/_types/model/groups";
import { deleteGroupAction } from '@/app/_actions/groups';
import { CustomToast } from '@/app/_components/toast';
import Confirm from '@/app/(site)/_components/confirm';
import { CustomCardIcon } from '@/app/(site)/_components/cardIcon';


export default function GroupsView({ groups }: {groups: GroupData[]}) {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()


  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addToast } = CustomToast();

  async function onSubmit(values: FieldValues) {
    const response = await createGroupAction(values.name);
    if (response.success) {
      router.refresh()
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

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
      <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }}>
        <Text fontSize='lg' fontWeight='400'>Groups</Text>
        <Text fontSize='sm' fontWeight='300'>Manage your groups.</Text>
      </VStack>
      <SimpleGrid spacing={1}>
        {!!groups &&
          groups.map((group) => (
            <Card key={group.id}
              size={{ base: 'xs', md: 'sm' }}
              variant={'infoCard'}>
              <CardBody>
                <CustomCardIcon icon={MdGroups} styleProps={{ marginRight: '4' }} />
                <Heading w='50%'
                  as={NextLink}
                  href={`/groups/${group.id}/transactions`}
                  fontSize={'md'} letterSpacing={'wide'}
                  fontWeight={100}>{group.name}</Heading>
                {group.createdById === sessionData?.user?.id &&
                  <ButtonGroup w='50%'>
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
                      onClick={onOpen}>
                      Remove
                    </Button>
                    <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                      onRemoveGroup(group.id); onClose();
                    }} mode="removeGroup" />
                  </ButtonGroup>
                }
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
      <Divider />
      <Card size={{ base: 'xs', md: 'sm' }} variant={'createCard'}>
        <CardHeader>
          <Heading fontSize='md' fontWeight={'light'}>Create a new Group</Heading>
        </CardHeader>
        <FormControl isInvalid={!!errors?.group}>
          <CardBody as='form' w={'100%'}
            onSubmit={handleSubmit(onSubmit)}>
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
            <Button w='50%' isLoading={isSubmitting} type='submit'
              fontSize={'xs'}
              size='sm' variant={"add"}>
              Create Group
            </Button>
            {errors?.group &&
              <FormErrorMessage >
                {errors.group.message?.toString()}
              </FormErrorMessage>
            }
          </CardBody>
        </FormControl>
      </Card>
    </Stack >
  )
}
