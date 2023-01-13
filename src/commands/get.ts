import {Grade, Info, Period, Subject, Type, Weight} from "../entity";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import {query, UseQueryOpts} from "../ts/commands";


function useGrades(options: UseQueryOpts<Grade[]> = {}) {
	return query("grades", options)
}

function useTypes(options: UseQueryOpts<Type[]> = {}) {
	return query("types", options)
}

function useSubjects(options: UseQueryOpts<Subject[]> = {}) {
	return query("subjects", options)
}

function usePeriods(options: UseQueryOpts<Period[]> = {}) {
	return query("periods", options)
}

function useNoteRange(options: UseQueryOpts<NoteRange> = {}) {
	return query("note_range", options)
}

function useWeights(options: UseQueryOpts<Weight[]> = {}) {
	return query("weights", options)
}

function useGradeModalDefaults(options: UseQueryOpts<GradeModalDefaults> = {}) {
	return query("grade_modal_defaults", options)
}

function useInfo(options: UseQueryOpts<Info> = {}) {
	return query("info", options)
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