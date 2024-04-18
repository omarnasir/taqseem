'use client'
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
}
  from "@chakra-ui/react";
import { FieldValues, useForm } from "react-hook-form";
import { createMembershipAction } from "@/app/_actions/memberships";
import { CustomToast } from '@/app/_components/toast';
import { GroupData } from "@/app/_types/model/groups";

export default function GroupAddUser(
  { group }: { group: GroupData }
) {
  const { addToast } = CustomToast();
  const router = useRouter();
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

  return (
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
  );
}