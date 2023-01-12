import {Grade, Period, Subject, Type} from "../entity";
import {QueryClient} from "@tanstack/react-query";
import {editMutation, UseMutationOpts} from "../ts/commands";
import {GradeModalDefaults, NoteRange} from "../entity/config";

function useEditGrade(queryClient: QueryClient, options: UseMutationOpts<Grade> = {}) {
	return editMutation(queryClient, "grade", options, "grades")
}

function useEditType(queryClient: QueryClient, options: UseMutationOpts<Type> = {}) {
	return editMutation(queryClient, "type", options, "types")
}

function useEditSubject(queryClient: QueryClient, options: UseMutationOpts<Subject> = {}) {
	return editMutation(queryClient, "subject", options, "subjects")
}

function useEditPeriod(queryClient: QueryClient, options: UseMutationOpts<Period> = {}) {
	return editMutation(queryClient, "period", options, "periods")
}

function useEditGradeModalDefaults(queryClient: QueryClient, options: UseMutationOpts<GradeModalDefaults> = {}) {
	return editMutation(queryClient, "grade_modal_defaults", options)
}

function useEditNoteRange(queryClient: QueryClient, options: UseMutationOpts<NoteRange> = {}) {
	return editMutation(queryClient, "note_range", options)
}


export {
	useEditGrade,
	useEditPeriod,
	useEditSubject,
	useEditType,
	useEditNoteRange,
	useEditGradeModalDefaults,
}