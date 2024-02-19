'use client'
import {
	theme as chakraTheme,
	extendTheme,
	type ThemeConfig
}
	from "@chakra-ui/react"

import { menuTheme } from "./elements/menu"
import { modalTheme } from "./elements/modal"
import { inputTheme } from "./elements/input"
import { formLabelTheme } from "./elements/formLabel"
import { buttonTheme } from "./elements/button"
import { checkboxTheme } from "./elements/checkbox"
import { cardTheme } from "./elements/card"
import { numberTheme } from "./elements/numberInput"
import { selectTheme } from "./elements/select"
import { listTheme } from "./elements/list"

const fonts = {
	...chakraTheme.fonts,
	body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
	heading: `Helvetica,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
}

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
}

const customTheme = extendTheme({ config, fonts },
	{
		colors: {
			black: '#0a0a0a',
			itemBgGray: '#101010',
			// bg: 'linear-gradient(135deg, rgb(32,31,35) 0%, rgb(25,25,31) 55%, rgb(23,22,26) 85%)',
			// bg: 'linear-gradient(135deg, rgb(30,29,33) 0%, rgb(19,20,25) 25%, rgb(25,25,30) 50% , rgb(19,20,25) 75%, rgb(30,29,33) 100%)',
			bg: 'radial-gradient(rgb(25,25,31) 0%, rgb(17,18,21) 80%)',
			// bg: 'rgba(31,31,33, 1)',
			// bgFooter: 'linear-gradient(205deg, rgb(20,19,19) 20%, rgb(35,35,35) 100%)',
			// bgCard: 'linear-gradient(135deg, rgba(25,25,25, 0.25) 0%, rgba(55,55,55, 0.20) 100%)',
			bgFooter: 'rgba(30,31,34, 1)',
			// bgCard: 'linear-gradient(to right, rgba(49,51,53, 0.45) 35%, rgba(60,61,65, 0.35) 100%)',
			bgModal: 'rgba(25,25,30, 1)',
			bgListItem: 'rgba(38, 41, 45, 0.35)',
			bgCard: 'rgba(48, 47, 51, 0.25)',
			loginbtn: {
				50: '#ffffff',
				100: '#ffffff',
				500: '#ffffff',
			},
		},
		styles: {
			global: {
				'html, body': {
					lineHeight: 'short',
					bg: 'bg',
				},
				'#__next': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh',
				},
				'a': {
					color: 'teal.500',
					transition: 'color 0.15s',
					transitionTimingFunction: 'ease-out',
					_hover: {
						color: 'gray.500',
					},
				},
			},
		},
		components: {
			Input: inputTheme,
			FormLabel: formLabelTheme,
			NumberInput: numberTheme,
			Select: selectTheme,
			Menu: menuTheme,
			Modal: modalTheme,
			Button: buttonTheme,
			Checkbox: checkboxTheme,
			Card: cardTheme,
			List: listTheme,
		}
	})

export default customTheme