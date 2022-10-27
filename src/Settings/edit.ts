import {invoke} from "@tauri-apps/api/tauri";

function editType(id: number, name: string, color: string): Promise<void> {
	return invoke("edit_type_js", {
		json: JSON.stringify({
			id: id,
			name: name,
			color: color
		})
	}).then(() => {
		console.log("Edited Type")
	}).catch((error) => {
		console.error("Edit Type", error)
		throw error
	})
}

function editSubject(id: number, name: string, color: string): Promise<void> {
	return invoke("edit_subject_js", {
		json: JSON.stringify({
			id: id,
			name: name,
			color: color
		})
	}).then(() => {
		console.log("Edited Subject")
	}).catch((error) => {
		console.error("Edit Subject", error)
		throw error
	})
}

function editPeriod(id: number, name: string, from: string, to: string): Promise<void> {
	return invoke("edit_period_js", {
		json: JSON.stringify({
			id: id,
			name: name,
			from: from,
			to: to,
		})
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