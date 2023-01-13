import {QueryClient} from "@tanstack/react-query";
import {resetMutation, UseMutationOpts} from "../ts/commands";

function useResetGradeModalDefaults(queryClient: QueryClient, options: UseMutationOpts<void> = {}) {
	return resetMutation(queryClient, "grade_modal_defaults", options)

}

function useResetNoteRange(queryClient: QueryClient, options: UseMutationOpts<void> = {}) {
	return resetMutation(queryClient, "note_range", options)
}


export {
	useResetGradeModalDefaults,
	useResetNoteRange
}