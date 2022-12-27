import {Grade, Info, Page, Period, Subject, Type} from "./entity"
import {GradeModalDefaults, NoteRange} from "./entity/config"

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
			default:
				// @ts-ignore
				window[`_${g.error}`]("Unknown command: " + g.cmd)
		}
	}
}