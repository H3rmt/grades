import {invoke} from "@tauri-apps/api/tauri";
import {Grade} from "../entity";

function editGrade(grade: Grade): Promise<void> {
	return invoke("edit_grade_js", {
		json: JSON.stringify(grade)
	}).then(() => {
		console.log("Edited Grade")
	}).catch((error) => {
		console.error("Edit Grade", error)
		throw error
	})
}


export {
	editGrade,
}