import {invoke} from "@tauri-apps/api/tauri";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import {QueryClient} from "@tanstack/react-query";

function saveNoteRange(noteRange: NoteRange, queryClient: QueryClient): Promise<void> {
	console.log(noteRange)
	return invoke("save_note_range_js", {
		json: JSON.stringify(noteRange)
	}).then(async () => {
		console.log("Save NoteRange")
		await queryClient.invalidateQueries({queryKey: ["noteRange"]})
	}).catch((error) => {
		console.error("Save NoteRange", error)
		throw error
	})
}

function saveGradeModalDefaults(gradeModalDefaults: GradeModalDefaults, queryClient: QueryClient): Promise<void> {
	console.log(gradeModalDefaults)
	return invoke("save_grade_modal_defaults_js", {
		json: JSON.stringify({
			period_default: gradeModalDefaults.period_default,
			subject_default: gradeModalDefaults.subject_default,
			type_default: gradeModalDefaults.type_default,
			grade_default: gradeModalDefaults.grade_default,
			info_default: '',
			not_final_default: false,
			double_default: false,
		})
	}).then(async () => {
		console.log("Save Defaults")
		await queryClient.invalidateQueries({queryKey: ["gradeModalDefaults"]})
	}).catch((error) => {
		console.error("Save Defaults", error)
		throw error
	})
}

export {
	saveNoteRange,
	saveGradeModalDefaults
}