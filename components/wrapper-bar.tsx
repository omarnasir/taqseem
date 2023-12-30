import { Flex } from "@chakra-ui/react";

export default function WrapperBar({
  children, as
}: {
  children: React.ReactNode;
  as: 'header' | 'footer';
}) {

  const commonProps = {
    bg: "itemBgGray",
    justify: "space-between",
    w: '100%',
    justifyContent: 'center'
  }

  if (as === 'header') {
    return (
      <Flex
        {...commonProps}
        borderBottom='1px'
        borderColor='gray.800'
      >
        {children}
      </Flex>
    )
  }
  else if (as === 'footer') {
    return (
      <Flex
        {...commonProps}
        borderTop='1px'
        borderColor='gray.800'
        position='absolute'
        bottom={0}
      >
        {children}
      </Flex>
    )
  }
  else {
    throw new Error('WrapperBar: invalid "as" prop')
  }
}