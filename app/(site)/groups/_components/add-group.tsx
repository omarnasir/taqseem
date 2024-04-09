'use client'
import { useRouter } from 'next/navigation'
import {
  Heading,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";

import { useForm, FieldValues } from "react-hook-form"
import { useSession } from "next-auth/react";

import { createGroup } from "@/app/(site)/groups/_lib/group-service";
import { CustomToast } from "@/app/_components/toast";


export default function AddGroup() 
{
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { addToast } = CustomToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createGroup({
      createdById: sessionData?.user?.id as string,
      name: values.name,
    })
    if (response.success) {
      router.refresh()
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
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
  );
}