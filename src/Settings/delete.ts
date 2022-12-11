import {invoke} from "@tauri-apps/api/tauri";
import {QueryClient} from "@tanstack/react-query";

function deleteType(id: number, queryClient: QueryClient): Promise<void> {
	return invoke("delete_type_js", {
		json: JSON.stringify({id: id})
	}).then(async () => {
		console.log("Deleted Type")
		await queryClient.invalidateQueries({queryKey: ["types"]})
	}).catch((error) => {
		console.error("Delete Type", error)
		throw error
	})
}

function deleteSubject(id: number, queryClient: QueryClient): Promise<void> {
	return invoke("delete_subject_js", {
		json: JSON.stringify({id: id})
	}).then(async () => {
		console.log("Deleted Subject")
		await queryClient.invalidateQueries({queryKey: ["subjects"]})
	}).catch((error) => {
		console.error("Delete Subject", error)
		throw error
	})
}

function deletePeriod(id: number, queryClient: QueryClient): Promise<void> {
	return invoke("delete_period_js", {
		json: JSON.stringify({id: id})
	}).then(async () => {
		console.log("Deleted Period")
		await queryClient.invalidateQueries({queryKey: ["periods"]})
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