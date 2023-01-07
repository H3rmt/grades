import {Grade, Info, Period, Subject, Type, Weight} from "../entity";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import {query, UseQueryOpts} from "../ts/commands";


function useGrades(options: UseQueryOpts<Grade[]> = {}) {
	return query<Grade[]>("grades", options)
}

function useTypes(options: UseQueryOpts<Type[]> = {}) {
	return query<Type[]>("types", options)
}

function useSubjects(options: UseQueryOpts<Subject[]> = {}) {
	return query<Subject[]>("subjects", options)
}

function usePeriods(options: UseQueryOpts<Period[]> = {}) {
	return query<Period[]>("periods", options)
}

function useNoteRange(options: UseQueryOpts<NoteRange> = {}) {
	return query<NoteRange>("note_range", options)
}

function useWeights(options: UseQueryOpts<Weight[]> = {}) {
	return query<Weight[]>("weights", options)
}

function useGradeModalDefaults(options: UseQueryOpts<GradeModalDefaults> = {}) {
	return query<GradeModalDefaults>("grade_modal_defaults", options)
}

function useInfo(options: UseQueryOpts<Info> = {}) {
	return query<Info>("info", options)
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