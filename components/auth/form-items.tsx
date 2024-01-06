import { Input } from "@chakra-ui/react";

import { FormItemWrapper } from "@/components/base-form-item";
import { type FormItemProps } from "@/types/form-item";


function EmailFormItem({ errors, register }: FormItemProps) {
  const id = 'email'

  return (
    <FormItemWrapper {...{ errors, id, title: 'Email', styleProps: {mb:3}}}>
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
    </FormItemWrapper >
  )
}

function PasswordFormItem(
  { errors, register }: FormItemProps
) {
  const id = 'password'

  return (
    <FormItemWrapper {...{ errors, id, title: 'Password', styleProps: {mb:3} }}>
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
    </FormItemWrapper >
  )
}

function NameFormItem(
  { errors, register }: FormItemProps
) {
  const id = 'name'

  return (
    <FormItemWrapper {...{ errors, id, title: 'Name', styleProps: {mb:3} }}>
      <Input
      {...register(id, {
        required: "Please enter your name.",
        minLength: {
          value: 2,
          message: 'Minimum length should be 2',
        },
      })}
      placeholder='Enter your name' />
    </FormItemWrapper >
  )
}

export {
  NameFormItem,
  EmailFormItem,
  PasswordFormItem
}