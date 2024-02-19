import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import { listAnatomy as parts } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  item: {
    alignItems: 'center',
    marginBottom: 2,
    rounded: 'lg',
    padding: 2,
    backgroundColor: 'bgListItem',
    backdropFilter: 'blur(10px)',
  },
})

export const listTheme = defineMultiStyleConfig({ variants: { transaction } })
