import {invoke} from "@tauri-apps/api/tauri";

function createGrade(grade: number, subject: string, type: string, info: string): Promise<void> {
	return invoke("create_grade_js", {
		json: JSON.stringify({
			grade: grade,
			subject: Number(subject),
			type: Number(type),
			info: info
		})
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