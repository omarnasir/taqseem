import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

type FormItemBaseProps = {
  errors: FieldErrors<FieldValues>,
  register: UseFormRegister<FieldValues>
}

type FormItemProps = FormItemBaseProps & {
  title: string,
  id: string,
  type?: string,
  placeholder?: string,
  registerParams?: {
    isRequired?: boolean,
    requiredErrorMessage?: string | '',
    pattern?: {
      value: RegExp,
      message: string | ''
    }
    minLength?: {
      value: number,
      message: string | ''
    }
  }
}

export {
  type FormItemBaseProps,
  type FormItemProps
}