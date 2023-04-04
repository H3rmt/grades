// @ts-ignore
window.__TAURI_METADATA__ = {
	__windows: [],
	__currentWindow: {label: 'main'},
}

global.console = {
	...console,
	debug: () => {
		// ignore debug messages
	},
	// log: () => {},
	// info: () => {},
	// warn: () => {},
	// error: () => {},
}