import {Grade, Info, Period, Subject, Type, Weight} from "../entity";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import {query} from "../ts/commands";
import {errorToast} from "../ts/toast";
import {UseQueryResult} from "@tanstack/react-query";
import {useUndefinedState} from "../ts/utils";
import {Dispatch, SetStateAction} from "react";
import {useSnackbar} from "notistack";


function useGrades() {
	return get<Grade[]>("grades", "Grades")
}

function useTypes() {
	return get<Type[]>("types", "Types")
}

function useSubjects() {
	return get<Subject[]>("subjects", "Subjects")
}

function usePeriods() {
	return get<Period[]>("periods", "Periods")
}

function useNoteRange() {
	return get<NoteRange>("note_range", "Note Range")
}

function useWeights() {
	return get<Weight[]>("weights", "Weights")
}

function useGradeModalDefaults() {
	return get<GradeModalDefaults>("grade_modal_defaults", "New Grade Defaults")
}

function useInfo() {
	return get<Info>("info", "Info")
}

function get<T>(key: string, name: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>, UseQueryResult<T, string | Error>] {
	const toast = useSnackbar()
	const [edit, setEdit] = useUndefinedState<T>()

	const dataServer = query<T>(key, {
		onSuccess: (data) => setEdit(data),
		onError: (error) => {
			errorToast(`Error loading ${name}`, toast, error)

		}
	})

	return [edit, setEdit, dataServer]
}

export {
	useTypes,
	useSubjects,
	usePeriods,
	useGrades,
	useWeights,
	useNoteRange,
	useGradeModalDefaults,
	useInfo
}