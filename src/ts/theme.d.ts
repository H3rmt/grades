declare module '@mui/material/styles' {

	interface Palette {
		off: Palette['primary'];
	}

	interface PaletteOptions {
		off: PaletteOptions['primary'];
	}
}

declare module '@mui/material/IconButton/IconButton' {
	interface IconButtonPropsColorOverrides {
		off: true;
	}
}

export {}