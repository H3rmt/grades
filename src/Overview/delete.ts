import {invoke} from "@tauri-apps/api/tauri";

function deleteGrade(id: number): Promise<void> {
	return invoke("delete_grade_js", {
		json: JSON.stringify({
			id: id
		})
	}).then(() => {
		console.log("Deleted Grade")
	}).catch((error) => {
		console.error("Delete Grade", error)
		throw error
	})
}

export {
	deleteGrade
}