import {invoke} from "@tauri-apps/api/tauri";
import {Period, Subject, Type} from "../entity";
import {nextFree} from "../ts/utils";

function createType(types: Type[]): Promise<void> {
	return invoke("create_type_js", {
		json: JSON.stringify({
			id: -1,
			name: nextFree(types.map(i => i.name), "New Type"),
			color: "#0045f5",
		})
	}).then(() => {
		console.log("Created new Type")
	}).catch((error) => {
		console.error("Create Type", error)
		throw error
	})
}

function createSubject(subjects: Subject[]): Promise<void> {
	return invoke("create_subject_js", {
		json: JSON.stringify({
			id: -1,
			name: nextFree(subjects.map(i => i.name), "New Subject"),
			color: "#1eff05",
		})
	}).then(() => {
		console.log("Created new Subject")
	}).catch((error) => {
		console.error("Create Subject", error)
		throw error
	})
}

function createPeriod(periods: Period[]): Promise<void> {
	return invoke("create_period_js", {
		json: JSON.stringify({
			id: -1,
			name: nextFree(periods.map(i => i.name), "New Period"),
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
	createType,
	createSubject,
	createPeriod
}