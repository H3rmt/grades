import React from 'react'
import './index.css'
import {createRoot} from "react-dom/client";
import App from "./App";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#6c7de0'
		},
		secondary: {
			main: '#f50057',
		},
	},
});

createRoot(document.getElementById('root')!).render(
		<React.StrictMode>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline enableColorScheme/>
				<App/>
			</ThemeProvider>
		</React.StrictMode>
)