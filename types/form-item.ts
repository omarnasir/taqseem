import { 
  FieldErrors, 
  FieldValues,  
  UseFormRegister, 
} from "react-hook-form"

type FormItemProps = {
  register: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>,
  id?: string,
  getValues?: any,
}

export {
  type FormItemProps,
}