import {invoke} from "@tauri-apps/api/tauri";
import {Grade, Info, Period, Subject, Type} from "../entity";
import {useQuery} from "@tanstack/react-query";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import {UseQueryOpts} from "../ts/utils";


function useTypes(options: UseQueryOpts<Type[]> = {}) {
	return useQuery<Type[]>(["types"],
			async () => {
				// @ts-ignore
				return await invoke("get_types_js").then((data: string) => {
					console.debug("get_types_js", data)
					return JSON.parse(data)
				})
			},
			options
	);
}

function useSubjects(options: UseQueryOpts<Subject[]> = {}) {
	return useQuery<Subject[]>(["subjects"],
			async () => {
				// @ts-ignore
				return await invoke("get_subjects_js").then((data: string) => {
					console.debug("get_subjects_js", data)
					return JSON.parse(data)
				})
			},
			options
	);
}

function usePeriods(options: UseQueryOpts<Period[]> = {}) {
	return useQuery<Period[]>(["periods"],
			async () => {
				// @ts-ignore
				return await invoke("get_periods_js").then((data: string) => {
					console.debug("get_periods_js", data)
					return JSON.parse(data)
				})
			},
			options
	);
}

function useGrades(options: UseQueryOpts<Grade[]> = {}) {
	return useQuery<Grade[]>(["grades"],
			async () => {
				// @ts-ignore
				return await invoke("get_grades_js").then((data: string) => {
					console.debug("get_grades_js", data)
					return JSON.parse(data)
				})
			},
			options
	);
}


function useNoteRange(options: UseQueryOpts<NoteRange> = {}) {
	return useQuery<NoteRange>(["noteRange"],
			async () => {
				// @ts-ignore
				return await invoke("get_note_rage_js").then((data: string) => {
					console.debug("get_note_rage_js", data)
					return JSON.parse(data)
				})
			},
			options
	);
}


function useGradeModalDefaults(options: UseQueryOpts<GradeModalDefaults> = {}) {
	return useQuery<GradeModalDefaults>({
		queryKey: ["gradeModalDefaults"],
		queryFn: async () => {
			// @ts-ignore
			return await invoke("get_grade_modal_defaults_js").then((data: string) => {
				console.debug("get_grade_modal_defaults_js", data)
				return JSON.parse(data)
			})
		},
		...options
	})
}

function useInfo(options: UseQueryOpts<Info> = {}) {
	return useQuery<Info>({
		queryKey: ["info"],
		queryFn: async () => {
			// @ts-ignore
			return await invoke("get_info_js").then((data: string) => {
				console.debug("get_info_js", data)
				return JSON.parse(data)
			})
		},
		...options
	});
}

export {
	useTypes,
	useSubjects,
	usePeriods,
	useGrades,
	useNoteRange,
	useGradeModalDefaults,
	useInfo
}