import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import { listAnatomy as parts } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  item: {
    alignItems: 'center',
    marginY: 2,
    rounded: 'md',
    paddingY: 3,
    paddingX: 4,
    backgroundColor: 'bgListItem',

  },
})

export const listTheme = defineMultiStyleConfig({ variants: { transaction } })
