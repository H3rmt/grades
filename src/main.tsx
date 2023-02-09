import './index.css'
import '@fontsource/roboto/latin-300.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'

import {createRoot} from "react-dom/client"
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material"
import {SnackbarProvider} from "notistack"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import {StrictMode} from "react"
import {blue, pink, red} from "@mui/material/colors"
import {RouterProvider} from "@tanstack/react-router"
import {router} from "./ts/router"
import 'dayjs/locale/de.js'

export const theme = createTheme({
	palette: {
		mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		primary: {
			main: blue[800],
		},
		secondary: {
			main: pink[500]
		},
		error: {
			main: red[800]
		}
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

export const queryClient = new QueryClient({defaultOptions: {queries: {retry: 2, networkMode: 'always', refetchOnWindowFocus: false}}})

createRoot(document.getElementById("root") as HTMLElement).render(
		<StrictMode>
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
					<QueryClientProvider client={queryClient}>
						<CssBaseline enableColorScheme/>
						<SnackbarProvider maxSnack={5}>
							<RouterProvider router={router}/>
						</SnackbarProvider>
						<ReactQueryDevtools/>
					</QueryClientProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</StrictMode>
)