import React from 'react'
import './index.css'
import {createRoot} from "react-dom/client";
import App from "./App";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {SnackbarProvider} from "notistack";

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

createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline enableColorScheme/>
				<SnackbarProvider maxSnack={5}>
					<App/>
				</SnackbarProvider>
			</ThemeProvider>
		</React.StrictMode>
)