import {invoke} from "@tauri-apps/api/tauri";
import {Grade} from "../entity/grade";

function loadGrades(): Promise<Grade[]> {
	// @ts-ignore
	return invoke("get_grades_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error(error)
		throw error
	})
}

export {
	loadGrades
}