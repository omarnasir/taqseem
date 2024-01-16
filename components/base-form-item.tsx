import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import { type FormItemProps } from "@/types/form-item";
import React from "react";

function FormItemWrapper({ errors, id, title, children, styleProps }:
  {
    errors: FormItemProps['errors'],
    id: FormItemProps['id'],
    title?: string, 
    children: React.ReactNode,
    styleProps?: any
  }) {
  return (
    <FormControl isInvalid={!!errors?.[id!]} mb={3} {...styleProps}>
      {title && <FormLabel
        mb={'1'}
        fontSize={'sm'}
        fontWeight={400}
        htmlFor={id}>{title}</FormLabel>}
      {children}
      {errors?.[id!] &&
        <FormErrorMessage>
          {errors[id!]?.message?.toString()}
        </FormErrorMessage>}
    </FormControl>
  )
}

export {
  FormItemWrapper
}