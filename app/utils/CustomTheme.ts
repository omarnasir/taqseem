'use client'
import {
	theme as chakraTheme,
	extendTheme,
	type ThemeConfig
}
	from "@chakra-ui/react"

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
			black: '#16161D',
		},
		styles: {
			global: {
				'html, body': {
					color: 'black.600',
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
						color: 'teal.600',
					},
				},
			},
		},
	})

export default customTheme