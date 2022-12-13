import {invoke} from "@tauri-apps/api/tauri";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {UseMutationOpts} from "../ts/utils";

function useDeleteGrade(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return useMutation(["grades"],
			async (id: number) => {
				// @ts-ignore
				return await invoke("delete_grade_js", {
					json: JSON.stringify({id: id})
				}).then(async () => {
					console.log("Deleted Grade")
					await queryClient.invalidateQueries({queryKey: ["grades"]})
				})
			},
			options
	);
}


export {
	useDeleteGrade
}