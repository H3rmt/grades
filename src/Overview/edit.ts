import {invoke} from "@tauri-apps/api/tauri";
import {Grade} from "../entity";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {UseMutationOpts} from "../ts/utils";

function useEditGrade(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return useMutation(["grades"],
			async (grade: Grade) => {
				// @ts-ignore
				return await invoke("edit_grade_js", {
					json: JSON.stringify(grade)
				}).then(async () => {
					console.log("Edited Grade")
					await queryClient.invalidateQueries({queryKey: ["grades"]})
				})
			},
			options
	);
}


export {
	useEditGrade,
}