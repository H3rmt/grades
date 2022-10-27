import {invoke} from "@tauri-apps/api/tauri";

function deleteType(id: number): Promise<void> {
	return invoke("delete_type_js", {
		json: JSON.stringify({
			id: id
		})
	}).then(() => {
		console.log("Deleted Type")
	}).catch((error) => {
		console.error("Delete Type", error)
		throw error
	})
}

function deleteSubject(id: number): Promise<void> {
	return invoke("delete_subject_js", {
		json: JSON.stringify({
			id: id
		})
	}).then(() => {
		console.log("Deleted Type")
	}).catch((error) => {
		console.error("Delete Type", error)
		throw error
	})
}

function deletePeriod(id: number): Promise<void> {
	return invoke("delete_period_js", {
		json: JSON.stringify({
			id: id
		})
	}).then(() => {
		console.log("Deleted Period")
	}).catch((error) => {
		console.error("Delete Period", error)
		throw error
	})
}

export {
	deleteType,
	deleteSubject,
	deletePeriod,
}