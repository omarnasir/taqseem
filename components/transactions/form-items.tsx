import {
  Input,
  Select,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth
} from "react-icons/md"

import {
  FormItemWrapper, createRegisterOptions
} from '@/components/base-form-item';

import { type FormItemProps } from "@/types/form-item";
import React from "react";

const InputLeftElementStyleProps = {
  borderRightWidth: 1,
  borderColor: 'gray.700'
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
    <FormItemWrapper {...{ errors, id, title }}>
      <InputGroup >
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdDriveFileRenameOutline/>
        </InputLeftElement>
        <Input {...registerOptions} placeholder={placeholder} 
        textIndent={'7px'}/>
      </InputGroup>
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
  return (
    <FormItemWrapper {...{ errors, id, title }}>
      <InputGroup >
       <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdEuroSymbol />
        </InputLeftElement>
        <NumberInput w='100%'>
          <NumberInputField textIndent={'32px'} placeholder={placeholder} {...registerOptions} />
        </NumberInput>
      </InputGroup>
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

  const options = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'house', label: 'House' },
    { value: 'fun', label: 'Fun' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <FormItemWrapper {...{ errors, id, title }}>
      <InputGroup>
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdCategory />
        </InputLeftElement>
        <Select {...registerOptions} placeholder={placeholder}
        sx={{ paddingLeft: '3rem' }}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
          </Select>
      </InputGroup>
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
      <InputGroup>
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdCalendarMonth />
        </InputLeftElement>
      <Input {...registerOptions} placeholder={placeholder} 
      fontWeight={'light'}
      textIndent={'3px'}
      type='datetime-local' />
      </InputGroup>
    </FormItemWrapper >)
}

export {
  FormItemName,
  FormItemAmount,
  FormItemCategory,
  FormItemDateTime
}