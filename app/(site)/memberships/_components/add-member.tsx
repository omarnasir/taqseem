'use client'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  Input,
  VStack,
}
  from "@chakra-ui/react";
import { type UserBasicData } from "@/app/_types/model/users";
import { FieldValues, useForm } from "react-hook-form";
import { createMembership } from "@/app/(site)/memberships/_lib/memberships-service";
import { CustomToast } from '@/app/_components/toast';
import { GroupData } from "@/app/_types/model/groups";

export default function GroupAddUser(
  { group, users, setUsers }: {
    group: GroupData,
    users: UserBasicData[],
    setUsers: React.Dispatch<React.SetStateAction<UserBasicData[]>>
  }
) {
  const { addToast } = CustomToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createMembership({
      groupId: group.id,
      userEmail: values.email
    });
    if (response.success) {
      setUsers([...users, response.data])
      addToast("User added", `${values.email} was added to group ${group.name}`, "success")
      reset()
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    <Box p={1}>
      <Heading marginX={4} size='sm' fontWeight='light'>Add a new User</Heading>
      <FormControl isInvalid={!!errors?.email}>
        <VStack>
          <HStack mt={4}
            as='form' w='100%'
            flexDirection={'row'}
            alignContent={'center'}
            onSubmit={handleSubmit(onSubmit)}>
            <Input
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
            <Button
              w='50%'
              variant={'login'}
              isLoading={isSubmitting}
              type='submit'>
              Add User
            </Button>
          </HStack>
          {errors?.email &&
            <FormErrorMessage alignSelf={'flex-start'}>
              {errors.email.message?.toString()}
            </FormErrorMessage>
          }
        </VStack>
      </FormControl>
    </Box>
  );
}