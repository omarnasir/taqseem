'use client'
import {
  Heading,
  FormControl,
  FormErrorMessage,
  Input,
  HStack,
  Button,
  Box,
  VStack,
} from "@chakra-ui/react";

import { useForm, FieldValues } from "react-hook-form"
import { useSession } from "next-auth/react";

import { createGroup } from "@/client/services/group-service";
import { type GroupData } from "@/types/model/groups";
import { CustomToast } from "@/components/toast";


export default function AddGroup({ groups, setGroups }: {
  groups: GroupData[],
  setGroups: React.Dispatch<React.SetStateAction<GroupData[]>>
}) {
  const { data: sessionData } = useSession();

  const { addToast } = CustomToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: FieldValues) {
    const response = await createGroup({
      createdById: sessionData!.user.id,
      name: values.name,
    })
    if (response.success) {
      setGroups([...groups, response.data!])
    }
    else {
      addToast("Error creating group", response.error, "error")
    }
  }

  return (
    <Box p={1}>
      <Heading marginX={4} size='md' fontWeight='light'>Create a new Group</Heading>
      <FormControl isInvalid={!!errors?.group}>
        <VStack>
          <HStack mt={4}
            as='form' w={'100%'}
            flexDirection={'row'}
            alignContent={'center'}
            justifyContent={'center'}
            onSubmit={handleSubmit(onSubmit)}>
            <Input
              id='name'
              variant='outline'
              placeholder='Name of your group'
              {...register('name', {
                required: 'This is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters long',
                }
              })}
            />
            <Button
              w='50%'
              bg={'gray.100'}
              colorScheme='loginbtn'
              textColor='green.900'
              isLoading={isSubmitting}
              type='submit'>
              Create
            </Button>
          </HStack>
          {errors?.group &&
            <FormErrorMessage >
              {errors.group.message?.toString()}
            </FormErrorMessage>
          }
        </VStack>
      </FormControl>
    </Box>
  );
}