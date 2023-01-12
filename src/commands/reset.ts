import {QueryClient, useMutation} from "@tanstack/react-query";
import {reset, UseMutationOpts} from "../ts/utils";

function useResetGradeModalDefaults(queryClient: QueryClient, options: UseMutationOpts<void> = {}) {
	return useMutation(["gradeModalDefaults"], async () => {
				return await reset("grade_modal_defaults").then(async () => {
					console.log("Edited GradeModalDefaults")
					await queryClient.invalidateQueries({queryKey: ["gradeModalDefaults"]})
				})
			},
			options
	);
}

function useResetNoteRange(queryClient: QueryClient, options: UseMutationOpts<void> = {}) {
	return useMutation(["noteRange"], async () => {
				return await reset("note_range").then(async () => {
					console.log("Edited NoteRange")
					await queryClient.invalidateQueries({queryKey: ["noteRange"]})
				})
			},
			options
	);
}


export {
	useResetGradeModalDefaults,
	useResetNoteRange
}