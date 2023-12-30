import { Flex } from "@chakra-ui/react";

export default function WrapperBar({
  children, as
}: {
  children: React.ReactNode;
  as: 'header' | 'footer';
}) {

  const props = as === 'header' ? {
    borderBottom: '1px',
  } : as === 'footer' ? {
    borderTop: '1px',
    position: 'absolute' as const,
    bottom: 0,
  } : {}

  return (
    <Flex
      {...props}
      bg="itemBgGray"
      borderColor={'gray.800'}
      justify="space-between" 
      w='100%' 
      justifyContent={'center'}
    >
      {children}
    </Flex>
  )
}