// @ts-ignore
if (window.__TAURI_IPC__ === undefined) {
	console.warn("DEFINE")
	// @ts-ignore
	window.__TAURI_IPC__ = (g) => {
		console.log("__TAURI_IPC__: ", g);
		switch (g.cmd) {
			case "get_periods_js":
				// @ts-ignore
				return window[`_${g.callback}`]('[{"id": 1, "name": "TEST","from":"12.23.1", "to":"12.1.12"}]')
			case "get_types_js":
				// @ts-ignore
				return window[`_${g.callback}`]("[]")
			case "get_subjects_js":
				// @ts-ignore
				return window[`_${g.callback}`]("[]")
			case "get_grades_js":
				// @ts-ignore
				return window[`_${g.callback}`]("[]")
			case "get_note_range_js":
				// @ts-ignore
				return window[`_${g.callback}`]("{}")
			case "get_grade_modal_defaults_js":
				// @ts-ignore
				return window[`_${g.callback}`]("{}")
			case "get_info_js":
				// @ts-ignore
				return window[`_${g.callback}`]("{}")
			case "get_page_from_cache_js":
				// @ts-ignore
				return window[`_${g.callback}`]("{}")
			default:
				// @ts-ignore
				window[`_${g.error}`]("Unknown command: " + g.cmd)
		}
	}
}

export {}