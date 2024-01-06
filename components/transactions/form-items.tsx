import {
  Input,
  Select,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import {
  MdEuroSymbol, MdDriveFileRenameOutline, MdCategory,
  MdCalendarMonth
} from "react-icons/md"

import { FormItemWrapper } from '@/components/base-form-item';

import { type FormItemProps } from "@/types/form-item";
import { GroupWithMembers } from "@/types/model/groups";
import { UserBasicData } from "@/types/model/users";

const InputLeftElementStyleProps = {
  borderRightWidth: 1,
  borderColor: 'gray.700'
}

function FormItemName(
  { errors, register }: FormItemProps
) {
  const id = 'name'

  return (
    <FormItemWrapper {...{ errors, id, title: 'Name' }}>
      <InputGroup >
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdDriveFileRenameOutline/>
        </InputLeftElement>
        <Input {...register(id, {
          required: true,
        })}
        placeholder='Give a name to the transaction' 
        textIndent={'7px'}/>
      </InputGroup>
    </FormItemWrapper >)
}

function FormItemAmount(
  {errors, register, users} : 
  FormItemProps & { users: UserBasicData[] }
) {
  const amountId = 'amount'

  return (
    <FormItemWrapper {...{ errors, id: amountId, title: 'Amount' }}>
      <InputGroup >
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdEuroSymbol />
        </InputLeftElement>
        <NumberInput w='100%'>
          <NumberInputField textIndent={'32px'} 
            placeholder='Enter the amount'
            {...register(amountId, {
              required: true,
            })} />
        </NumberInput>
      </InputGroup>
      <TableContainer>
        <Table variant='simple'>
          <Tbody>
            {users.map((user: UserBasicData) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>
                  <NumberInput w='50%'>
                    <NumberInputField
                    {...register(user.id, {
                      required: true,
                      validate: (
                        value, formValues
                      ) => value === (formValues.amount
                        - formValues.)
                    })}/>
                  </NumberInput>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      </FormItemWrapper>
  )
}

function FormItemCategory(
  { errors, register }: FormItemProps
) {
  const id = 'category'

  const options = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'house', label: 'House' },
    { value: 'fun', label: 'Fun' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <FormItemWrapper {...{ errors, id, title: 'Category' }}>
      <InputGroup>
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdCategory />
        </InputLeftElement>
        <Select {...register(id, {
          required: true,
        })}
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
  { errors, register }: FormItemProps
) { 
  const id = 'datetime'
 
  return (
    <FormItemWrapper {...{ errors, id, title: 'Date' }}>
      <InputGroup>
        <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
          <MdCalendarMonth />
        </InputLeftElement>
        <Input {...register(id, {
          required: true,
        })} 
        placeholder='Select a date and time'
          fontWeight={'light'}
          textIndent={'3px'}
          type='date'
          defaultValue={getCurrentDate()} />
      </InputGroup>
    </FormItemWrapper >
  )
}

function FormItemPaidBy(
  { errors, register, users }: FormItemProps & { users: GroupWithMembers['users'] }
) {
  const id = 'paidBy'

  return (
      <FormItemWrapper {...{ errors, id, title:'Paid by' }}>
        <InputGroup>
          <InputLeftElement pointerEvents='none' {...InputLeftElementStyleProps}>
            <MdCategory />
          </InputLeftElement>
          <Select {...register(id, {
          required: true,
        })}
          sx={{ paddingLeft: '3rem' }}>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
            </Select>
        </InputGroup>
      </FormItemWrapper >
  )
}

function getCurrentDate() {
  const currentDate = new Date()
  const formatter = new Intl.DateTimeFormat('en-ca', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',

  })
  const formattedDate = formatter.format(currentDate)
  return formattedDate
}

export {
  FormItemName,
  FormItemAmount,
  FormItemCategory,
  FormItemDateTime,
  FormItemPaidBy,
  getCurrentDate
}