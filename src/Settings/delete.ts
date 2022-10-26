import {invoke} from "@tauri-apps/api/tauri";

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
	deletePeriod
}