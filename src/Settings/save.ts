import {invoke} from "@tauri-apps/api/tauri";
import {GradeModalDefaults, NoteRange} from "../entity/config";

function saveNoteRange(noteRange: NoteRange): Promise<void> {
	return invoke("save_note_range_js", {
		json: JSON.stringify({
			from: noteRange.from,
			to: noteRange.to
		})
	}).then(() => {
		console.log("Save NoteRange")
	}).catch((error) => {
		console.error("Save NoteRange", error)
		throw error
	})
}

function saveDefaults(defaults: GradeModalDefaults): Promise<void> {
	return invoke("save_defaults_js", {
		json: JSON.stringify({
			period_default: defaults.period_default,
			grade_default: defaults.grade_default,
			subject_default: defaults.subject_default,
			type_default: '',
			info_default: '',
			not_final_default: false,
			double_default: false,
		})
	}).then(() => {
		console.log("Save Defaults")
	}).catch((error) => {
		console.error("Save Defaults", error)
		throw error
	})
}

export {
	saveNoteRange,
	saveDefaults
}