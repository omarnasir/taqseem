import { 
  FieldErrors, 
  FieldValues,  
  UseFormRegister, 
} from "react-hook-form"

type FormItemProps = {
  errors: FieldErrors<FieldValues>,
  register: UseFormRegister<FieldValues>,
  id: string,
}

export {
  type FormItemProps,
}