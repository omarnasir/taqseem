import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

enum ConfirmMessages {
  USER = 'Are you sure you want to remove this user from the group?',
  GROUP = 'Are you sure you want to remove this group?',
  TRANSACTION = 'Are you sure you want to remove this transaction?',
  SETTLEMENT = 'Are you sure you want to settle? This can create multiple transactions.'
}

enum ConfirmTitle {
  USER = 'Remove User',
  GROUP = 'Remove Group',
  TRANSACTION = 'Remove Transaction',
  SETTLEMENT = 'Settle Up'
}

type ConfirmProps = {
  onClose: () => void,
  isOpen: boolean,
  callback: () => void,
  mode: 'removeUser' | 'removeGroup' | 'removeTransaction' | 'settlement'
}

function getMessageAndTitle(mode: ConfirmProps['mode']): {
  message: string,
  title: string
} {
  switch (mode) {
    case 'removeUser':
      return {
        message: ConfirmMessages.USER,
        title: ConfirmTitle.USER
      }
    case 'removeGroup':
      return {
        message: ConfirmMessages.GROUP,
        title: ConfirmTitle.GROUP
      }
    case 'removeTransaction':
      return {
        message: ConfirmMessages.TRANSACTION,
        title: ConfirmTitle.TRANSACTION
      }
    case 'settlement':
      return {
        message: ConfirmMessages.SETTLEMENT,
        title: ConfirmTitle.SETTLEMENT
      }
  }
}


export default function Confirm({ onClose, isOpen, callback, mode }: ConfirmProps) {
  const cancelRef = useRef(null)
  const [description, setDescription] = useState<{ message: string, title: string }>({
    message: '',
    title: ''
  })

  useEffect(() => {
    setDescription(getMessageAndTitle(mode))
  }, [mode])

  return (
    <AlertDialog
      motionPreset='slideInBottom'
      variant={'confirm'}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{description.title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{description.message}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button colorScheme='red' ml={3} onClick={callback}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}