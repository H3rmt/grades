import {invoke} from "@tauri-apps/api/tauri";

function createPeriod(): Promise<void> {
	return invoke("create_period_js", {
		json: JSON.stringify({
			id: -1,
			name: "New Period",
			from: "2021-01-01",
			to: "2021-01-31",
		})
	}).then(() => {
		console.log("Created new Period")
	}).catch((error) => {
		console.error("Create Period", error)
		throw error
	})
}

export {
	createPeriod
}