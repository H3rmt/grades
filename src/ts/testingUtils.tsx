import {createTheme, CssBaseline, ThemeProvider} from "@mui/material"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactElement, ReactNode} from "react"
import {render, RenderOptions} from "@testing-library/react"
// @ts-ignore
import * as mediaQuery from 'css-mediaquery'
import {SnackbarProvider} from "notistack"
import {Grade, Info, Page, Period, Subject, Type} from "../entity"
import {GradeModalDefaults, NoteRange} from "../entity/config"
import {Atom, Provider} from "jotai"
import {blue, pink} from "@mui/material/colors"
import {createRouteConfig, Outlet, ReactRouter, RouterProvider} from "@tanstack/react-router"


export const theme = createTheme({
	palette: {
		mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		primary: {
			main: blue[800],
		},
		secondary: {
			main: pink[500]
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
})

type A<T> = [Atom<T>, T]

export const rootRoute = createRouteConfig({
	component: Outlet
})

export function AllTheProviders({atoms}: { atoms?: A<any>[] }): ({children}: { children: ReactNode }) => JSX.Element {
	const queryClient = new QueryClient({
		defaultOptions: {queries: {retry: 2, networkMode: 'always', refetchOnWindowFocus: false}}
	})

	return ({children}: { children: ReactNode }) => {
		const testRoute = rootRoute.createRoute({path: '/', component: () => <>{children}</>})

		const routeConfig = rootRoute.addChildren([testRoute])

		const router = new ReactRouter({routeConfig,})

		return <Provider initialValues={atoms}>
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<QueryClientProvider client={queryClient}>
						<CssBaseline enableColorScheme/>
						<SnackbarProvider maxSnack={5}>
							<RouterProvider router={router}/>
						</SnackbarProvider>
					</QueryClientProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</Provider>
	}
}

export function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { atoms?: A<any>[] }) {
	return render(ui, {wrapper: AllTheProviders({atoms: options?.atoms ?? []}), ...options})
}

export function createMatchMedia(width: string): (query: string) => MediaQueryList {
	return (query: string) => ({
		matches: mediaQuery.match(query, {width}),
		addListener: () => {
		},
		removeListener: () => {
		},
	} as unknown as MediaQueryList)
}

export function rgbStringToHex(rgb: string) {
	const [r, g, b] = rgb.replace('rgb(', '').replace(')', '').split(",").map((x) => parseInt(x.trim()))
	return rgbToHex(r, g, b)
}

export function rgbToHex(r: number, g: number, b: number) {
	return '#' + [r, g, b].map(x => {
		const hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}).join('')
}

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
			case "get_weights_js":
				// @ts-ignore
				return window[`_${g.callback}`](JSON.stringify([
					{"name": "Normal", "value": "{}*1"},
					{"name": "Double", "value": "{}*2"},
					{"name": "Half", "value": "{}/2"},
					{"name": "Ignore", "value": "{}*0"}]))
			default:
				// @ts-ignore
				window[`_${g.error}`]("Unknown command: " + g.cmd)
		}
	}
}

export function trimAll(str: string | null) {
	return str?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() ?? ''
}

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export * from '@testing-library/react'
export {customRender as render}
