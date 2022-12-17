import {Grade, Period, Subject, Type} from "../entity";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {edit, UseMutationOpts} from "../ts/utils";
import {GradeModalDefaults, NoteRange} from "../entity/config";

function useEditGrade(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return useMutation(["grades"], async (grade: Grade) => {
				return await edit("grade", grade).then(async () => {
					console.log("Edited Grade")
					await queryClient.invalidateQueries({queryKey: ["grades"]})
				})
			},
			options
	);
}

function useEditPeriod(queryClient: QueryClient, options: UseMutationOpts<void, Period> = {}) {
	return useMutation(["periods"], async (period: Period) => {
				return await edit("period", period).then(async () => {
					console.log("Edited Period")
					await queryClient.invalidateQueries({queryKey: ["periods"]})
				})
			},
			options
	);
}

function useEditSubject(queryClient: QueryClient, options: UseMutationOpts<void, Subject> = {}) {
	return useMutation(["subjects"], async (subject: Subject) => {
				return await edit("subject", subject).then(async () => {
					console.log("Edited Subject")
					await queryClient.invalidateQueries({queryKey: ["subjects"]})
				})
			},
			options
	);
}

function useEditType(queryClient: QueryClient, options: UseMutationOpts<void, Type> = {}) {
	return useMutation(["types"], async (type: Type) => {
				return await edit("type", type).then(async () => {
					console.log("Edited Type")
					await queryClient.invalidateQueries({queryKey: ["types"]})
				})
			},
			options
	);
}

function useEditGradeModalDefaults(queryClient: QueryClient, options: UseMutationOpts<void, GradeModalDefaults> = {}) {
	return useMutation(["gradeModalDefaults"], async (gradeModalDefaults: GradeModalDefaults) => {
				return await edit("grade_modal_defaults", gradeModalDefaults).then(async () => {
					console.log("Edited GradeModalDefaults")
					await queryClient.invalidateQueries({queryKey: ["gradeModalDefaults"]})
				})
			},
			options
	);
}

function useEditNoteRange(queryClient: QueryClient, options: UseMutationOpts<void, NoteRange> = {}) {
	return useMutation(["noteRange"], async (noteRange: NoteRange) => {
				return await edit("note_range", noteRange).then(async () => {
					console.log("Edited NoteRange")
					await queryClient.invalidateQueries({queryKey: ["noteRange"]})
				})
			},
			options
	);
}


export {
	useEditGrade,
	useEditPeriod,
	useEditSubject,
	useEditType,
	useEditNoteRange,
	useEditGradeModalDefaults,
}