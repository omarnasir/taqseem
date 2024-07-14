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
    paddingY: 4,
    paddingX: 3,
    boxShadow: '0px 8px 24px 0 rgba(0,0,0,0.2)',
    bg: 'bgListItem',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})

const activity = definePartsStyle({
  item: {
    alignItems: 'center',
    marginY: 2,
    rounded: 'md',
    paddingY: 3,
    paddingX: 4,
    backgroundColor: 'bgListItem',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})

const groupBalances = definePartsStyle({
  item: {
    marginBottom: 4,
    rounded: 'md',
    borderBottomWidth: 0.5,
    borderRadius: 0,
  },
})

const members = definePartsStyle({
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginY: 2,
    rounded: 'md',
    paddingY: 2,
    paddingX: 4,
    backgroundColor: 'bgListItem',
  },
})


export const listTheme = defineMultiStyleConfig({ variants: { transaction , activity, members, groupBalances } })
