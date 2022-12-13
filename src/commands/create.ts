import {invoke} from "@tauri-apps/api/tauri";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {UseMutationOpts} from "../ts/utils";
import {Grade} from "../entity";

function useCreateGrade(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return useMutation(["grades"],
			async (grade: Grade) => {
				// @ts-ignore
				return await invoke("create_grade_js", grade).then(async () => {
					console.log("Created Grade")
					await queryClient.invalidateQueries({queryKey: ["grades"]})
				})
			},
			options
	);
}

export {
	useCreateGrade
}