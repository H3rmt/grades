import {Grade, Info, Page, Period, Subject, Type} from "./entity"
import {GradeModalDefaults, NoteRange} from "./entity/config"

window.__TAURI_METADATA__ = {
	__windows: [],
	__currentWindow: {label: "test"},
}

global.console = {
	...console,
	debug: () => {},
	log: () => {},
	// info: () => {},
	// warn: () => {},
	// error: () => {},
};