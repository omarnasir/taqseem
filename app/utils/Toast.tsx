import {
  Button,
  useToast
} from "@chakra-ui/react"


export function CustomToast() {
  const toast = useToast()

  const addToast = (title: string,
    description: string | null,
    status: "info" | "warning" | "success" | "error",
    duration?: number) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: duration ? duration : 3000,
      isClosable: true,
    })
  }
  return { addToast };
}