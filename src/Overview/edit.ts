import {invoke} from "@tauri-apps/api/tauri";

function editGrade(id: number, grade: number, subject: number, type: number, info: string, period: number, double: boolean, notFinal: boolean): Promise<void> {
	return invoke("edit_grade_js", {
		json: JSON.stringify({
			id: id,
			grade: grade,
			subject: subject,
			type: type,
			info: info,
			period: period,
			double: double,
			not_final: notFinal
		})
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