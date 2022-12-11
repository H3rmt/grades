import {invoke} from "@tauri-apps/api/tauri";
import {Period, Subject, Type} from "../entity";
import {QueryClient} from "@tanstack/react-query";

function editType(type: Type, queryClient: QueryClient): Promise<void> {
	return invoke("edit_type_js", {
		json: JSON.stringify(type)
	}).then(async () => {
		console.log("Edited Type")
		await queryClient.invalidateQueries({queryKey: ["types"]})
	}).catch((error) => {
		console.error("Edit Type", error)
		throw error
	})
}

function editSubject(subject: Subject, queryClient: QueryClient): Promise<void> {
	return invoke("edit_subject_js", {
		json: JSON.stringify(subject)
	}).then(async () => {
		console.log("Edited Subject")
		await queryClient.invalidateQueries({queryKey: ["subjects"]})
	}).catch((error) => {
		console.error("Edit Subject", error)
		throw error
	})
}

function editPeriod(period: Period, queryClient: QueryClient): Promise<void> {
	return invoke("edit_period_js", {
		json: JSON.stringify(period)
	}).then(async () => {
		console.log("Edited Period")
		await queryClient.invalidateQueries({queryKey: ["periods"]})
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