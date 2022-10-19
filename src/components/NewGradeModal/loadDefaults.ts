import {invoke} from "@tauri-apps/api/tauri";
import {GradeModalDefaults, NoteRange} from "../../entity/config";

async function loadNoteRange(): Promise<NoteRange> {
	// @ts-ignore
	return await invoke("get_note_rage_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load note range", error)
		throw error
	})
}

async function loadDefaults(): Promise<GradeModalDefaults> {
	// @ts-ignore
	return await invoke("get_grade_modal_defaults").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load grade modal defaults", error)
		throw error
	})
}


export {
	loadDefaults,
	loadNoteRange
}