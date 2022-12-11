import {invoke} from "@tauri-apps/api/tauri";
import {Grade} from "../entity";
import {QueryClient} from "@tanstack/react-query";

function editGrade(grade: Grade, queryClient: QueryClient): Promise<void> {
	return invoke("edit_grade_js", {
		json: JSON.stringify(grade)
	}).then(async () => {
		console.log("Edited Grade")
		await queryClient.invalidateQueries({queryKey: ["grades"]})
	}).catch((error) => {
		console.error("Edit Grade", error)
		throw error
	})
}

export {
	editGrade,
}