import {Grade, Info, Period, Subject, Type, Weight} from "../entity";
import {useQuery} from "@tanstack/react-query";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import {get, UseQueryOpts} from "../ts/utils";


function useTypes(options: UseQueryOpts<Type[]> = {}) {
	return useQuery<Type[]>(["types"], async () => {
				return await get<Type[]>("types")
			},
			options
	);
}

function useSubjects(options: UseQueryOpts<Subject[]> = {}) {
	return useQuery<Subject[]>(["subjects"], async () => {
				return await get<Subject[]>("subjects")
			},
			options
	);
}

function usePeriods(options: UseQueryOpts<Period[]> = {}) {
	return useQuery<Period[]>(["periods"], async () => {
				return await get<Period[]>("periods")
			},
			options
	);
}

function useGrades(options: UseQueryOpts<Grade[]> = {}) {
	return useQuery<Grade[]>(["grades"], async () => {
				return await get<Grade[]>("grades")
			},
			options
	);
}

function useWeights(options: UseQueryOpts<Weight[]> = {}) {
	return useQuery<Weight[]>(["weights"], async () => {
				return await get<Weight[]>("weights")
			},
			options
	);
}


function useNoteRange(options: UseQueryOpts<NoteRange> = {}) {
	return useQuery<NoteRange>(["noteRange"], async () => {
				return await get<NoteRange>("note_rage")
			},
			options
	);
}


function useGradeModalDefaults(options: UseQueryOpts<GradeModalDefaults> = {}) {
	return useQuery<GradeModalDefaults>(["gradeModalDefaults"], async () => {
				return await get<GradeModalDefaults>("grade_modal_defaults")
			},
			options
	)
}

function useInfo(options: UseQueryOpts<Info> = {}) {
	return useQuery<Info>(["info"], async () => {
				return await get<Info>("info")
			},
			options
	);
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