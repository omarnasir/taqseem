'use client'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  Input,
}
  from "@chakra-ui/react";
import { type UserMembershipByGroup } from "@/types/model/memberships";
import { FieldValues, useForm } from "react-hook-form";
import { createMembership } from "@/client/services/membershipService";
import { CustomToast } from '@/components/ui/toast';

export default function GroupAddUser(
  { groupId, users, setUsers }: {
    groupId: string,
    users: UserMembershipByGroup[],
    setUsers: React.Dispatch<React.SetStateAction<UserMembershipByGroup[]>>
  }
) {
  const { addToast } = CustomToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createMembership({
      groupId: groupId,
      userEmail: values.email
    });
    console.log(response)
    if (response.success) {
      setUsers([...users, response.data.membership!])
      addToast("User added", `User ${values.email} was added to the group`, "success")
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    <Box p={1}>
      <Heading marginX={4} size='md' fontWeight='light'>Add a new User</Heading>
      <HStack mt={4}
        as='form'
        flexDirection={'row'}
        alignContent={'center'}
        justifyContent={'center'}
        onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors?.group}>
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
          Add User
        </Button>
      </HStack>
    </Box>
  );
}