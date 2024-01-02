import {
  FormControl,
  Grid,
  GridItem,
  Text,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

import { type FormItemProps } from "@/types/form-item";
import { useState } from "react";
import React from "react";


function createRegisterOptions({ register, id, registerParams }:
  {
    register: FormItemProps['register'], id: FormItemProps['id'],
    registerParams: FormItemProps['registerParams']
  }) {
  return {
    ...register(id, {
      required: registerParams?.isRequired ? registerParams.isRequired : false,
      pattern: registerParams?.pattern ? registerParams.pattern : undefined,
      minLength: registerParams?.minLength ? registerParams.minLength : undefined,
    })
  }
}

function FormItemWrapper({ errors, id, title, children }:
  {
    errors: FormItemProps['errors'],
    id: FormItemProps['id'],
    title: string, children: React.ReactNode
  }) {
  return (
    <FormControl isInvalid={!!errors?.[id]}>
      <Grid mb={3}
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(7, 1fr)'>
        <GridItem rowSpan={1} colSpan={2} mb={1}>
          <Text mt={1} alignSelf={'center'}>{title}</Text>
        </GridItem>
        <GridItem colSpan={5}>
          {children}
        </GridItem>
      </Grid>
    </FormControl>)
}

function FormItemName(
  { errors, register }: {
    errors: FormItemProps['errors'],
    register: FormItemProps['register']
  }
) {
  const id = 'name'
  const placeholder = 'Give a name to the transaction'
  const title = 'Name'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true
    }
  })
  return (
    < FormItemWrapper {...{ errors, id, title }}>
      <Input {...registerOptions} placeholder={placeholder} />
    </FormItemWrapper >)
}

function FormItemAmount(
  { errors, register }: {
    errors: FormItemProps['errors'],
    register: FormItemProps['register']
  }
) {
  const id = 'amount'
  const placeholder = 'Enter the amount'
  const title = 'Amount'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true
    }
  })
  const format = (val: string) => `€` + val
  const parse = (val: string) => val.replace(/^\€/, '')

  const [value, setValue] = useState('0')
  return (
    <FormItemWrapper {...{ errors, id, title }}>
      <NumberInput id={id} onChange={(valueString) => setValue(parse(valueString))}
          value={format(value)}>
        <NumberInputField placeholder={placeholder} {...registerOptions}/>
      </NumberInput>
    </FormItemWrapper >)
}

function FormItemCategory(
  { errors, register }: {
    errors: FormItemProps['errors'],
    register: FormItemProps['register']
  }
) {
  const id = 'category'
  const placeholder = 'Select a category'
  const title = 'Category'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true
    }
  })
  return (
    <FormItemWrapper {...{ errors, id, title }}>
      <Input {...registerOptions} placeholder={placeholder} />
    </FormItemWrapper >)
}

function FormItemDateTime(
  { errors, register }: {
    errors: FormItemProps['errors'],
    register: FormItemProps['register']
  }
) {
  const id = 'datetime'
  const placeholder = 'Select a date and time'
  const title = 'Date and time'
  const registerOptions = createRegisterOptions({
    register: register,
    id: id,
    registerParams: {
      isRequired: true
    }
  })
  return (
    <FormItemWrapper {...{ errors, id, title }}>
      <Input {...registerOptions} placeholder={placeholder} type='datetime-local' />
    </FormItemWrapper >)
}

export {
  FormItemName,
  FormItemAmount,
  FormItemCategory,
  FormItemDateTime
}