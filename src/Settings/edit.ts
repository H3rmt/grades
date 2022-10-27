import {invoke} from "@tauri-apps/api/tauri";

function editType(id: number, name: string, color: string): Promise<void> {
	return invoke("edit_type_js", {
		json: JSON.stringify({
			id: id,
			name: name,
			color: color
		})
	}).then(() => {
		console.log("Created new Type")
	}).catch((error) => {
		console.error("Create Type", error)
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
		console.log("Created new Subject")
	}).catch((error) => {
		console.error("Create Subject", error)
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
		console.log("Created new Period")
	}).catch((error) => {
		console.error("Create Period", error)
		throw error
	})
}

export {
	editType,
	editSubject,
	editPeriod
}