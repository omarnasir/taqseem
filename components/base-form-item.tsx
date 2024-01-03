import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import { type FormItemProps } from "@/types/form-item";
import React from "react";


function createRegisterOptions({ register, id, registerParams }:
  {
    register: FormItemProps['register'], id: FormItemProps['id'],
    registerParams: FormItemProps['registerParams']
  }) {
  return {
    ...register(id, {
      required: registerParams?.isRequired ?
        registerParams.requiredErrorMessage ? registerParams.requiredErrorMessage : true : false,
      pattern: registerParams?.pattern ? registerParams.pattern : undefined,
      minLength: registerParams?.minLength ? registerParams.minLength : undefined,
    })
  }
}

function FormItemWrapper({ errors, id, title, children, styleProps }:
  {
    errors: FormItemProps['errors'],
    id: FormItemProps['id'],
    title: string, children: React.ReactNode,
    styleProps?: any
  }) {
  return (
    <FormControl isInvalid={!!errors?.[id]} mb={3} {...styleProps}>
      <FormLabel fontSize={'15px'} fontWeight={'light'}
      htmlFor={id}>{title}</FormLabel>
      {children}
      {errors?.[id] &&
        <FormErrorMessage>
          {errors[id]?.message?.toString()}
        </FormErrorMessage>}
    </FormControl>
  )
}

export {
  FormItemWrapper,
  createRegisterOptions
}