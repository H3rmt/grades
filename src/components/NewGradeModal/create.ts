import {invoke} from "@tauri-apps/api/tauri";
import {Grade} from "../../entity";
import {QueryClient} from "@tanstack/react-query";

function createGrade(grade: Grade, queryClient: QueryClient): Promise<void> {
	return invoke("create_grade_js", {
		json: JSON.stringify(grade)
	}).then(async () => {
		console.log("Created new Grade")
		await queryClient.invalidateQueries({queryKey: ["grades"]})
	}).catch((error) => {
		console.error("Create Grade", error)
		throw error
	})
}

export {
	createGrade
}