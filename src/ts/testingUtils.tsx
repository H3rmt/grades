import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactElement, ReactNode} from "react";
import {render, RenderOptions} from "@testing-library/react";
// @ts-ignore
import * as mediaQuery from 'css-mediaquery';
import {SnackbarProvider} from "notistack";
import {Grade, Info, Page, Period, Subject, Type} from "../entity";
import {GradeModalDefaults, NoteRange} from "../entity/config";

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#383838'
		},
		secondary: {
			main: '#f50000'
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 700,
			md: 900,
			lg: 1150,
			xl: 1536,
		},
	},
});

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#383838'
		},
		secondary: {
			main: '#f50000'
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 700,
			md: 900,
			lg: 1150,
			xl: 1536,
		},
	},
});

const AllTheProviders = ({children}: { children: ReactNode }) => {
	const queryClient = new QueryClient({
		defaultOptions: {queries: {retry: 2, networkMode: 'always', refetchOnWindowFocus: false}}
	});

	return <ThemeProvider theme={darkTheme}>
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<QueryClientProvider client={queryClient}>
				_<CssBaseline enableColorScheme/>
				<SnackbarProvider maxSnack={5}>
					{children}
				</SnackbarProvider>
			</QueryClientProvider>
		</LocalizationProvider>
	</ThemeProvider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>,) => render(ui, {wrapper: AllTheProviders, ...options})

function createMatchMedia(width: string): (query: string) => MediaQueryList {
	return (query: string) => ({
		matches: mediaQuery.match(query, {width}),
		addListener: () => {
		},
		removeListener: () => {
		},
	} as unknown as MediaQueryList);
}

const rgbStringToHex = (rgb: string) => {
	const [r, g, b] = rgb.replace('rgb(', '').replace(')', '').split(",").map((x) => parseInt(x.trim()))
	return rgbToHex(r, g, b)
}

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
	const hex = x.toString(16)
	return hex.length === 1 ? '0' + hex : hex
}).join('')

export function mockIPC(args: { periods?: Period[], types?: Type[], subjects?: Subject[], grades?: Grade[], noteRange?: NoteRange, gradeModalDefaults?: GradeModalDefaults, info?: Info, pageFromCache?: Page }) {
	window.__TAURI_IPC__ = (g) => {
		switch (g.cmd) {
			case "get_periods_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.periods ?? []))
			case "get_types_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.types ?? []))
			case "get_subjects_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.subjects ?? []))
			case "get_grades_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.grades ?? []))
			case "get_note_range_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.noteRange ?? {}))
			case "get_grade_modal_defaults_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.gradeModalDefaults ?? {}))
			case "get_info_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.info ?? {}))
			case "get_page_from_cache_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify(args.pageFromCache ?? {}))
			default:
				// @ts-ignore
				window[`_${g.error}`]("Unknown command: " + g.cmd)
		}
	}
}

export {
	AllTheProviders,
	rgbToHex,
	rgbStringToHex,
	createMatchMedia
}

export * from '@testing-library/react'
export {customRender as render}
