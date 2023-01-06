// @ts-ignore
window.__TAURI_METADATA__ = {
	__windows: [],
	__currentWindow: {label: "test"},
}

global.console = {
	...console,
	debug: () => {
	},
	log: () => {
	},
	// info: () => {},
	// warn: () => {},
	// error: () => {},
};