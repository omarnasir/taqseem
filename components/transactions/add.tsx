import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Flex,
  HStack,
  useDisclosure,
  Text,
  VStack
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form";

import { GroupWithMembers } from "@/types/model/groups"
import { 
  type TFormIds,
  FormIds,
  FormItemAmount, 
  FormItemAmountDetails, 
  FormItemCategory, 
  FormItemSubCategory,
  FormItemDateTime,
  FormItemName,
  FormItemPaidBy,
  processAmountDetails,
  getCurrentDate
} from "@/components/transactions/form-items";

export function Add(
  { groupDetail }: { groupDetail: GroupWithMembers }
) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const methods = useForm<TFormIds>({
    defaultValues: {
      name: '',
      category: 0,
      subcategory: 0,
      amount: '0',
      datetime: getCurrentDate(),
      amountDetails: [],
      everyone: true,
    }
  })
  const {
    handleSubmit,
    reset,
  } = methods

  function onSubmit(values: TFormIds) {
    const everyone = values[FormIds.everyone] as boolean;
    const totalAmount = parseFloat(values[FormIds.amount]);
    if (everyone) {
      const userDetails = groupDetail.users!.map(user => {
        return {
          id: user.id,
          amount: totalAmount / groupDetail.users!.length
        }
      })
      console.log('Case 1: ', { ...userDetails })
    }
    else {
      const amountDetails = values[FormIds.amountDetails] as TFormIds[FormIds.amountDetails];
      const { selectedUsers, usersWithoutInputAmount, sum } = processAmountDetails(amountDetails)
      const remainingAmount = totalAmount - sum;
      const owedAmountPerRemainingUser = remainingAmount / usersWithoutInputAmount.length;
      const userDetails = selectedUsers.map((selectedUser) => {
        return {
          id: selectedUser.id,
          amount: (selectedUser.amount === null) ? owedAmountPerRemainingUser : parseFloat(selectedUser.amount)
        }
      })
      console.log('Case 2: ', { ...userDetails })
    }
    console.log(values)
    // submit here
    return
  }

  return (
    <VStack w='100%'>
      <HStack w='100%' justifyContent={'space-between'}>
        <Text fontSize='xl' fontWeight='bold'>{groupDetail.name}</Text>
        <Button size={'md'} borderRadius={'full'}
        onClick={onOpen}><Text fontSize={'xl'}>+</Text></Button>
      </HStack>
      <Divider marginY={2}/>
      <FormProvider {...methods}>
        <Modal
          blockScrollOnMount={false}
          isOpen={isOpen}
          onClose={onClose}
          size={{ xl: 'lg', base: 'lg', "2xl": 'xl' }}>
          <ModalOverlay />
          <ModalContent marginX={2}
            as='form' onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader
              textAlign={'left'}
              fontSize={'lg'}
              fontWeight={'bold'}>New transaction</ModalHeader>
            <Divider />
            <ModalCloseButton />
            <ModalBody>
              <FormItemName />
              <FormItemDateTime />
              <HStack>
                <FormItemCategory />
                <FormItemSubCategory />
              </HStack>
              <FormItemPaidBy {...{ users: groupDetail.users! }} />
              <FormItemAmount />
              <FormItemAmountDetails {...{ users: groupDetail.users! }} />
            </ModalBody>
            <ModalFooter>
              <Flex direction={'row'} justifyContent={'space-between'} w='100%'>
                <Button size={'sm'} fontWeight={'400'}
                  textAlign={'center'} variant={'none'} textColor='gray.500'
                  onClick={() => reset()}>
                  Clear
                </Button>
                <Button size={'sm'} w={'7rem'} fontWeight={'600'}
                  bg={'gray.100'} colorScheme='loginbtn' textColor='black'
                  isLoading={methods.formState.isSubmitting} type='submit'>
                  Add
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FormProvider>
    </VStack>
  )
}