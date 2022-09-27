import {invoke} from "@tauri-apps/api/tauri";
import {Type} from "../../entity/type";
import {Subject} from "../../entity/subject";

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

export {
	loadTypes,
	loadSubjects
}