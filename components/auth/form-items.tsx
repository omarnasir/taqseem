import { Input } from "@chakra-ui/react";

import { FormItemWrapper, createRegisterOptions } from "@/components/base-form-item";
import { type FormItemBaseProps } from "@/types/form-item";


function EmailFormItem({ errors, register }: FormItemBaseProps) {
  const id = 'email'
  const placeholder = 'Enter your email'
  const title = 'Email'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true,
      requiredErrorMessage: 'Email is required',
        pattern: {
          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          message: 'Invalid email address',
        },
      }
  })
  return (
    <FormItemWrapper {...{ errors, id, title, styleProps: {mb:3}}}>
        <Input {...registerOptions} 
        type="email"
        placeholder={placeholder} />
    </FormItemWrapper >
  )
}

function PasswordFormItem(
  { errors, register }: FormItemBaseProps
) {
  const id = 'password'
  const placeholder = 'Enter your password'
  const title = 'Password'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true,
      requiredErrorMessage: 'Password is required',
      minLength: {
        value: 4,
        message: 'Minimum length should be 4',
      },
    }
  })
  return (
    <FormItemWrapper {...{ errors, id, title, styleProps: {mb:3} }}>
      <Input {...registerOptions} 
        type="password"
        placeholder={placeholder} />
    </FormItemWrapper >
  )
}

function NameFormItem(
  { errors, register }: FormItemBaseProps
) {
  const id = 'name'
  const placeholder = 'Enter your name'
  const title = 'Name'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true,
      requiredErrorMessage: 'Please enter your name.',
      minLength: {
        value: 2,
        message: 'Minimum length should be 2',
      },
    }
  })
  return (
    <FormItemWrapper {...{ errors, id, title, styleProps: {mb:3} }}>
      <Input {...registerOptions} placeholder={placeholder} />
    </FormItemWrapper >
  )
}

export {
  NameFormItem,
  EmailFormItem,
  PasswordFormItem
}