import {invoke} from "@tauri-apps/api/tauri";

function editNoteRange(from: number, to: number): Promise<void> {
	return invoke("save_note_range_js", {
		json: JSON.stringify({
			from: from,
			to: to
		})
	}).then(() => {
		console.log("Save NoteRange")
	}).catch((error) => {
		console.error("Save NoteRange", error)
		throw error
	})
}

export {
	editNoteRange
}