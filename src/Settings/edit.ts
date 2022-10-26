import {invoke} from "@tauri-apps/api/tauri";

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
	editPeriod
}