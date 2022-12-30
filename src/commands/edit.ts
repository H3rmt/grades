import {Grade, Period, Subject, Type} from "../entity";
import {QueryClient} from "@tanstack/react-query";
import {editMutation, UseMutationOpts} from "../ts/commands";
import {GradeModalDefaults, NoteRange} from "../entity/config";

function useEditGrade(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return editMutation(queryClient, "grade", options)
}

function useEditPeriod(queryClient: QueryClient, options: UseMutationOpts<void, Period> = {}) {
	return editMutation(queryClient, "period", options)
}

function useEditSubject(queryClient: QueryClient, options: UseMutationOpts<void, Subject> = {}) {
	return editMutation(queryClient, "subject", options)
}

function useEditType(queryClient: QueryClient, options: UseMutationOpts<void, Type> = {}) {
	return editMutation(queryClient, "type", options)
}

function useEditGradeModalDefaults(queryClient: QueryClient, options: UseMutationOpts<void, GradeModalDefaults> = {}) {
	return editMutation(queryClient, "gradeModalDefaults", options)
}

function useEditNoteRange(queryClient: QueryClient, options: UseMutationOpts<void, NoteRange> = {}) {
	return editMutation(queryClient, "noteRange", options)
}


export {
	useEditGrade,
	useEditPeriod,
	useEditSubject,
	useEditType,
	useEditNoteRange,
	useEditGradeModalDefaults,
}