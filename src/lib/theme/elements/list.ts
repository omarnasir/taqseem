import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import { listAnatomy as parts } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const transaction = definePartsStyle({
  item: {
    alignItems: 'center',
    // borderBottomWidth: 0.5,
    // borderColor: 'whiteAlpha.300',
    borderRadius: 'lg',
    display: 'flex',
    background: 'itemSurface',
    paddingX: 3,
  },
})

const activity = definePartsStyle({
  item: {
    alignItems: 'center',
    borderRadius: 'lg',
    display: 'flex',
    background: 'itemSurface',
    paddingX: 3,
  },
})

const groupBalances = definePartsStyle({
  item: {
    display: 'flex',
    borderRadius: 'lg',
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
        marginY: 3,
        paddingY: '9px',
      }
    },
    variants: { transaction, activity, members, groupBalances }
  }
)
