import {invoke} from "@tauri-apps/api/tauri";
import {Grade} from "../../entity";

function createGrade(grade: Grade): Promise<void> {
	return invoke("create_grade_js", {
		json: JSON.stringify(grade)
	}).then(() => {
		console.log("Created new Grade")
	}).catch((error) => {
		console.error("Create Grade", error)
		throw error
	})
}

export {
	createGrade
}