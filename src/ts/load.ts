import {invoke} from "@tauri-apps/api/tauri";
import {Grade, Period, Subject, Type} from "../entity";

function loadTypes(): Promise<Type[]> {
	// @ts-ignore
	return invoke("get_types_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load Types", error)
		throw error
	})
}

function loadSubjects(): Promise<Subject[]> {
	// @ts-ignore
	return invoke("get_subjects_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load Subjects", error)
		throw error
	})
}

function loadPeriods(): Promise<Period[]> {
	// @ts-ignore
	return invoke("get_periods_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load Subjects", error)
		throw error
	})
}

function loadGrades(): Promise<Grade[]> {
	// @ts-ignore
	return invoke("get_grades_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error(error)
		throw error
	})
}


export {
	loadTypes,
	loadSubjects,
	loadPeriods,
	loadGrades
}