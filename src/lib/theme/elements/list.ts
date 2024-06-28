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
    backgroundColor: 'bgCard',
  },
})

const activity = definePartsStyle({
  item: {
    alignItems: 'center',
    marginY: 1.5,
    rounded: 'md',
    paddingY: 3,
    paddingX: 4,
    backgroundColor: 'bgCard',
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
    backgroundColor: 'bgCard',
  },
})


export const listTheme = defineMultiStyleConfig({ variants: { transaction , activity, members} })
