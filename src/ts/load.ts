import {invoke} from "@tauri-apps/api/tauri";
import {Grade, Period, Subject, Type} from "../entity";

async function loadTypes(): Promise<Type[]> {
	// @ts-ignore
	return await invoke("get_types_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load Types", error)
		throw error
	})
}

async function loadSubjects(): Promise<Subject[]> {
	// @ts-ignore
	return await invoke("get_subjects_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load Subjects", error)
		throw error
	})
}

async function loadPeriods(): Promise<Period[]> {
	// @ts-ignore
	return await invoke("get_periods_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load Subjects", error)
		throw error
	})
}

async function loadGrades(): Promise<Grade[]> {
	// @ts-ignore
	return await invoke("get_grades_js").then((data: string) => {
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