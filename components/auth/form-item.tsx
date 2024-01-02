import {
  FormControl,
  Input,
  FormErrorMessage,
  FormLabel
} from "@chakra-ui/react";

import {
  type FormItemProps,
  type FormItemBaseProps
} from "@/types/form-item";


function EmailFormItem(
  { errors, register }: FormItemBaseProps
) {
  return (
    <AuthFormItem {...{
      errors,
      register,
      title: 'Email',
      id: 'email',
      type: 'email',
      placeholder: 'email',
      registerParams: {
        requiredErrorMessage: 'Email is required',
        pattern: {
          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          message: 'Invalid email address',
        },
      }
    }} />
  )
}

function PasswordFormItem(
  { errors, register }: FormItemBaseProps
) {
  return (
    <AuthFormItem {...{
      errors,
      register,
      title: 'Password',
      id: 'password',
      placeholder: 'password',
      type: 'password',
      registerParams: {
        requiredErrorMessage: 'Password is required',
        minLength: {
          value: 4,
          message: 'Minimum length should be 4',
        },
      }
    }} />
  )
}

function AuthFormItem(
  { errors, register, title, type, id, placeholder, registerParams }: FormItemProps
) {
  return (
    <FormControl isInvalid={!!errors?.[id]} mb={3}>
      <FormLabel htmlFor={id}>{title}</FormLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder? placeholder : title}
        {...register(id, {
          required: registerParams?.requiredErrorMessage,
          pattern: registerParams?.pattern,
          minLength: registerParams?.minLength,
        })}
      />
      {errors?.[id] &&
        <FormErrorMessage>
          {errors[id]?.message?.toString()}
        </FormErrorMessage>
      }
    </FormControl>
  )
}

export {
  AuthFormItem,
  EmailFormItem,
  PasswordFormItem
}