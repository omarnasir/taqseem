'use client'
import {
	theme as chakraTheme,
	extendTheme,
	type ThemeConfig
}
	from "@chakra-ui/react"

import {menuTheme} from "./themes/menu"

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
			black: '#121212',
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
					bg: 'black',
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
						color: 'gray.600',
					},
				},
			},
		},
		components: {
			Input:{
				defaultProps: {
				focusBorderColor: 'white',
				},
			},
			Menu: menuTheme,
		}
	})

export default customTheme