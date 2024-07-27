'use client'
import {
	theme as chakraTheme,
	extendTheme,
	type ThemeConfig
}
from "@chakra-ui/react"

import '@fontsource/open-sans'
import '@fontsource/roboto'
import '@fontsource/montserrat';
import '@fontsource/raleway';
import '@fontsource/poppins';
import '@fontsource/lato';
import '@fontsource/source-sans-pro';


import { menuTheme } from "./elements/menu"
import { modalTheme } from "./elements/modal"
import { inputTheme } from "./elements/input"
import { formLabelTheme } from "./elements/form-label"
import { buttonTheme } from "./elements/button"
import { checkboxTheme } from "./elements/checkbox"
import { radioTheme } from "./elements/radio"
import { cardTheme } from "./elements/card"
import { numberTheme } from "./elements/numberInput"
import { selectTheme } from "./elements/select"
import { listTheme } from "./elements/list"
import { drawerTheme } from "./elements/drawer"
import { accordionTheme } from "./elements/accordion"
import { statTheme } from "./elements/stat"
import { tabTheme } from "./elements/tab"
import { textTheme } from "./elements/text"
import { headingTheme } from "./elements/heading"


const fonts = {
	...chakraTheme.fonts,
	// body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
	// heading: `Helvetica,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
	heading: `'Poppins'`,
	body: `'Lato'`,
}

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
}

const customTheme = extendTheme({ config, fonts },
	{
		colors: {
			black: '#161A1D',
			// bg: '#101317',
			// bg: '#000000',
			bg: 'linear-gradient(135deg, #0A0A15 0%, #1A1C24 100%)',
			// itemSurface: 'linear-gradient(45deg, #383A3F 0%, #28262A 100%)',
			itemSurface: 'linear-gradient(215deg, #181A22 0%, #24283A 100%)',
			// bg: 'rgba(25,25,25, 1)',
			// bgFooter: 'linear-gradient(205deg, rgb(20,19,19) 20%, rgb(35,35,35) 100%)',
			// bgCard: 'linear-gradient(135deg, rgba(25,25,25, 0.25) 0%, rgba(55,55,55, 0.20) 100%)',
			bgFooter: 'rgb(20,21,30)',
			// bgCard: 'linear-gradient(to right, rgba(49,51,53, 0.45) 35%, rgba(60,61,65, 0.35) 100%)',
			bgModal: 'rgba(25,25,30, 1)',
			// bgListItem: '#111114',
			bgListItem: 'linear-gradient(90deg, #24262A 0%, #303238 100%)',
			// bgListItem: 'rgba(40,44,48, 0.4)',
			bgCard: '#222529',
			loginbtn: {
				50: '#ffffff',
				100: '#ffffff',
				500: '#ffffff',
			},
			lent: '#58CC88',
			borrowed: '#FF6A6A',
		},
		styles: {
			global: {
				'html, body': {
					bg: 'bg',
				},
				':focus': {
					boxShadow: 'none !important',
				},
				'#__next': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh',
				},
				'a': {
					color: 'teal.500',
					boxShadow: 'none !important',
					_hover: {
						border: 'none',
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
			Radio: radioTheme,
			Card: cardTheme,
			List: listTheme,
			Drawer: drawerTheme,
			Accordion: accordionTheme,
			Stat: statTheme,
			Tabs: tabTheme,
			Text: textTheme,
			Heading: headingTheme
		}
	})

export default customTheme