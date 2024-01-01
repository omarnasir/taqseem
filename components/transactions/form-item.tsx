import {
  FormControl,
  Grid,
  GridItem,
  Text,
  Input,
  FormErrorMessage
} from "@chakra-ui/react";
import {
  type FieldErrors, 
  type UseFormRegister,
  type FieldValues
} from "react-hook-form";

export type FormItemProps = {
  errors: FieldErrors<FieldValues>,
  register: UseFormRegister<FieldValues>,
  title: string,
  id: string,
  placeholder: string,
  isRequired: boolean
}

export default function FormItem(
  { errors, register, title, id, placeholder, isRequired }: FormItemProps
) {
  return (
    <FormControl isInvalid={!!errors[id]}>
      <Grid mb={3}
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(7, 1fr)'>
        <GridItem rowSpan={1} colSpan={2} mb={1}>
          <Text mt={1} alignSelf={'center'}>{title}</Text>
        </GridItem>
        <GridItem colSpan={5}>
          <Input
            id={id}
            placeholder={placeholder}
            {...register(id, {
              required: isRequired ? isRequired : false
            })}
          />
        </GridItem>
      </Grid>
    </FormControl>
  )
}