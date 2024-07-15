import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import { listAnatomy as parts } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  item: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'whiteAlpha.300',
    borderRadius: 0,
    display: 'flex',
  },
})

const activity = definePartsStyle({
  item: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'whiteAlpha.300',
    borderRadius: 0,
    display: 'flex',
  },
})

const groupBalances = definePartsStyle({
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingY: 0,
  },
})

const members = definePartsStyle({
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    rounded: 'md',
    borderBottomWidth: 0.5,
    borderColor: 'whiteAlpha.300',
    borderRadius: 0,
  },
})


export const listTheme = defineMultiStyleConfig(
  {
    baseStyle: {
      item: {
        marginY: 2,
        paddingY: 3,
      }
    },
    variants: { transaction, activity, members, groupBalances }
  }
)
