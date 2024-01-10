import { 
  FieldErrors, 
  FieldValues,  
  UseFormRegister, 
} from "react-hook-form"

type FormItemProps = {
  errors: FieldErrors<FieldValues>,
  register: UseFormRegister<FieldValues>
  id?: string,
  getValues?: any,
}

export {
  type FormItemProps,
}