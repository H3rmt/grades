import './index.css'
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';

import App from "./App";

import {createRoot} from "react-dom/client";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {SnackbarProvider} from "notistack";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {StrictMode} from "react";

import "./ts/mock"


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

const queryClient = new QueryClient({defaultOptions: { queries: {retry: 1, networkMode: 'always', refetchOnWindowFocus: false}}});

createRoot(document.getElementById("root") as HTMLElement).render(
		<StrictMode>
			<ThemeProvider theme={darkTheme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<QueryClientProvider client={queryClient}>
						<CssBaseline enableColorScheme/>
						<SnackbarProvider maxSnack={5}>
							<App/>
						</SnackbarProvider>
						<ReactQueryDevtools/>
					</QueryClientProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</StrictMode>
)