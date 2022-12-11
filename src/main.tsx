import React from 'react'
import './index.css'
import {createRoot} from "react-dom/client";
import App from "./App";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {SnackbarProvider} from "notistack";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


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

const queryClient = new QueryClient({defaultOptions: {queries: {networkMode: 'always'}}});

createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
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
		</React.StrictMode>
)