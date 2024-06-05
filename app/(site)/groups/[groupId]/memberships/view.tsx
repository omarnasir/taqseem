'use client'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { FieldValues, useForm } from "react-hook-form";

import {
  Divider, Stack,
  Button,
  Text,
  CardBody,
  Card,
  useDisclosure,
  SimpleGrid,
  Heading,
  VStack,
  CardHeader,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { MdPerson, MdPersonRemove } from 'react-icons/md'

import { CustomToast } from "@/app/_components/toast";
import Confirm from "@/app/(site)/_components/confirm";
import { CustomCardIcon } from "@/app/(site)/_components/cardIcon";

import { createMembershipAction } from "@/app/_actions/memberships";

import { GroupData } from "@/app/_types/model/groups";
import { UserBasicData } from "@/app/_types/model/users";


import { deleteMembershipAction } from "@/app/_actions/memberships";


export default function MembershipsView({ group, memberships }:
   { group: GroupData, memberships: UserBasicData[] }
) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addToast } = CustomToast()

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
    }
    else {
      addToast("Error adding member", response.error, "error")
    }
  }

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

  return (
    <Stack direction={'column'} spacing={4} display={'flex'}>
      <VStack alignItems={'flex-start'} paddingX={{ base: 0, md: 3 }}>
        <Text fontSize='lg' fontWeight='400'>Members - {group.name}</Text>
        <Text fontSize='sm' fontWeight='300'>Add or remove members.</Text>
      </VStack>
      <SimpleGrid spacing={1}>
        {!!memberships ? memberships.map((member) => (
          <Card key={member.id}
            size={'xs'}
            variant={'infoCard'}>
            <CardBody>
              <CustomCardIcon icon={MdPerson} styleProps={{ marginRight: '4'}} />
              <Heading w='75%'
                fontSize={'md'}
                fontWeight={400}>{member.name}</Heading>
              {(group.createdById === sessionData?.user?.id ||
                member.id === sessionData?.user?.id) &&
                <VStack w='25%'>
                  <Button leftIcon={<MdPersonRemove />}
                    w='100%'
                    variant={'delete'}
                    onClick={onOpen}>
                    Remove
                  </Button>
                  <Confirm isOpen={isOpen} onClose={onClose} callback={() => {
                    onRemoveUser(member.id); onClose();
                  }} mode="removeUser" />
                </VStack>
              }
            </CardBody>
          </Card>
        )) : <Text>No members</Text>}
      </SimpleGrid>
      <Divider />
      <Card size={{ base: 'xs', md: 'sm' }} variant={'createCard'}>
      <CardHeader>
        <Heading fontSize='md' fontWeight={'light'}>Add a new User</Heading>
      </CardHeader>
      <FormControl isInvalid={!!errors?.email}>
        <CardBody as='form' w={'100%'}
          onSubmit={handleSubmit(onSubmit)}>
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
        </CardBody>
      </FormControl>
    </Card>
    </Stack>
  )
}