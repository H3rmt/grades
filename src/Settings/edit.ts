import {invoke} from "@tauri-apps/api/tauri";
import {Period, Subject, Type} from "../entity";

function editType(type: Type): Promise<void> {
	return invoke("edit_type_js", {
		json: JSON.stringify(type)
	}).then(() => {
		console.log("Edited Type")
	}).catch((error) => {
		console.error("Edit Type", error)
		throw error
	})
}

function editSubject(subject: Subject): Promise<void> {
	return invoke("edit_subject_js", {
		json: JSON.stringify(subject)
	}).then(() => {
		console.log("Edited Subject")
	}).catch((error) => {
		console.error("Edit Subject", error)
		throw error
	})
}

function editPeriod(period: Period): Promise<void> {
	return invoke("edit_period_js", {
		json: JSON.stringify(period)
	}).then(() => {
		console.log("Edited Period")
	}).catch((error) => {
		console.error("Edit Period", error)
		throw error
	})
}

export {
	editType,
	editSubject,
	editPeriod
}