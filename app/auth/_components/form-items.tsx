import { 
  FormControl, 
  FormErrorMessage, 
  FormLabel, 
  Input
} from "@chakra-ui/react";

import { useFormContext } from "react-hook-form";


function EmailFormItem() {
  const { formState: { errors }, register } = useFormContext()
  const id = 'email'

  return (
    <FormControl id={id} isInvalid={Boolean(errors[id])} mb={3}>
      <FormLabel htmlFor={id}>Email</FormLabel>
      <Input
        {...register(id, {
          required: "Email is required",
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            message: 'Invalid email address',
          },
        })}
        type="email"
        placeholder='Enter your email' />

      <FormErrorMessage>{errors[id]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function PasswordFormItem() {
  const { formState: { errors }, register } = useFormContext()
  const id = 'password'

  return (
    <FormControl id={id} isInvalid={Boolean(errors[id])} mb={3}>
      <FormLabel htmlFor={id}>Password</FormLabel>
      <Input
        {...register(id, {
          required: "Password is required",
          minLength: {
            value: 4,
            message: 'Minimum length should be 4',
          },
        })}
        type="password"
        placeholder='Enter your password' />
      <FormErrorMessage>{errors[id]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

function NameFormItem() {
  const { formState: { errors }, register } = useFormContext()
  const id = 'name'

  return (
    <FormControl id={id} isInvalid={Boolean(errors[id])} mb={3}>
      <FormLabel htmlFor={id}>Name</FormLabel>
      <Input
        {...register(id, {
          required: "Please enter your name.",
          minLength: {
            value: 2,
            message: 'Minimum length should be 2',
          },
        })}
        placeholder='Enter your name' />
      <FormErrorMessage>{errors[id]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  )
}

export {
  NameFormItem,
  EmailFormItem,
  PasswordFormItem
}