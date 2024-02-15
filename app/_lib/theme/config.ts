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
			// bg: 'linear-gradient(270deg, rgb(13,14,16) 0%, rgb(25,25,27) 100%)',
			bg: 'rgba(19,20,22, 1)',
			// bgFooter: 'linear-gradient(205deg, rgb(20,19,19) 20%, rgb(35,35,35) 100%)',
			// bgCard: 'linear-gradient(135deg, rgba(25,25,25, 0.25) 0%, rgba(55,55,55, 0.20) 100%)',
			bgHeader: 'rgba(19,20,22, 1)',
			bgFooter: 'rgba(25,25,28, 1)',
			bgCard: 'linear-gradient(to right, rgba(39,41,43, 0.35) 35%, rgba(60,61,65, 0.35) 100%)',
			bgModal: 'rgba(25,25,28, 1)',
			loginbtn: {
				50: '#ffffff',
				100: '#ffffff',
				500: '#ffffff',
			},
		},
		styles: {
			global: {
				'html, body': {
					lineHeight: 'tall',
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
		}
	})

export default customTheme