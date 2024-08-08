'use client'
import { useRouter } from "next/navigation";

import { FieldValues, useForm } from "react-hook-form";

import {
  Button,
  Text,
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
  DrawerContent,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerFooter,
  Box,
} from "@chakra-ui/react";

import { MdPerson, MdPersonRemove } from 'react-icons/md'

import { CustomToast } from "@/components/toast";
import { Confirm } from "@/app/(site)/components/confirm";

import { createMembershipAction, deleteMembershipAction } from "@/server/actions/memberships.action";
import { GroupData } from "@/types/groups.type";

import { useGetGroupMemberships } from "@/client/hooks/memberships.hook";


export default function MembershipsView({ 
  group, sessionUserId, disclosureProps, isOpen, onCloseDrawer }:
   { group: GroupData, sessionUserId: string, disclosureProps: any,
    isOpen: boolean,
    onCloseDrawer: any }
) {
  const router = useRouter();
  const { addToast } = CustomToast()

  const memberships = useGetGroupMemberships(group.id, undefined)

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
    <Drawer
      size={{ base: 'full', md: 'md' }}
      placement={{ base: 'bottom', lg: 'right' }}
      allowPinchZoom={true}
      variant={'transaction'}
      isOpen={isOpen}
      onClose={() => { onCloseDrawer() }}
      {...disclosureProps}>
      <DrawerOverlay />
      <DrawerContent height='100%' margin='auto'>
        <DrawerHeader w='100%' height={'12vh'} position='absolute'>
          <Heading size='h2'>{group.name}</Heading>
          <Heading size='h3' marginY={2}>Manage memberships.</Heading>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody position='absolute' overflowX={'clip'}  width='100%'
          overflowY={'scroll'} paddingBottom={20}
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
          top={'12vh'}
          bottom={'10vh'}>
          <SimpleGrid spacing={1}>
            <List w='100%' variant={'members'}>
              {!!memberships ? memberships.map((member) => (
                <ListItem w='100%' key={member.id}>
                  <MdPerson width={'20%'} />
                  <Heading width={'50%'}
                    size={'md'}
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
        </DrawerBody>
        <DrawerFooter position={'absolute'}
          zIndex={1700}
          w={'100%'}
          borderTopWidth={1}
          borderTopColor={'whiteAlpha.200'}
          h='30vh'
          overflow={'hidden'}
          bottom={0}>
          <VStack spacing={4} width={'100%'}>
            <Heading size='h3'>Add a new Member</Heading>
            <FormControl isInvalid={!!errors?.email}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input
                  size={['sm', 'lg']}
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
                <Box width={'100%'} textAlign={'end'}>
                  <Button w='40%' isLoading={isSubmitting} type='submit'
                    fontSize={'xs'}
                    size='sm' variant={"add"}>
                    Add User
                  </Button>
                  {errors?.email &&
                    <FormErrorMessage alignSelf={'flex-start'}>
                      {errors.email.message?.toString()}
                    </FormErrorMessage>
                  }
                </Box>
              </form>
            </FormControl>
          </VStack>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  )
}