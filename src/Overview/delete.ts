import {invoke} from "@tauri-apps/api/tauri";
import {QueryClient} from "@tanstack/react-query";

function deleteGrade(id: number, queryClient: QueryClient): Promise<void> {
	return invoke("delete_grade_js", {
		json: JSON.stringify({id: id})
	}).then(async () => {
		console.log("Deleted Grade")
		await queryClient.invalidateQueries({queryKey: ["grades"]})
	}).catch((error) => {
		console.error("Delete Grade", error)
		throw error
	})
}

export {
	deleteGrade
}