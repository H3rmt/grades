import {invoke} from "@tauri-apps/api/tauri";
import {Period, Subject, Type} from "../entity";
import {nextFree} from "../ts/utils";
import {QueryClient} from "@tanstack/react-query";

function createType(types: Type[], queryClient: QueryClient): Promise<void> {
	return invoke("create_type_js", {
		json: JSON.stringify({
			id: -1,
			name: nextFree(types.map(i => i.name), "New Type"),
			color: "#0045f5",
		})
	}).then(async () => {
		console.log("Created new Type")
		await queryClient.invalidateQueries({queryKey: ["types"]})
	}).catch((error) => {
		console.error("Create Type", error)
		throw error
	})
}

function createSubject(subjects: Subject[], queryClient: QueryClient): Promise<void> {
	return invoke("create_subject_js", {
		json: JSON.stringify({
			id: -1,
			name: nextFree(subjects.map(i => i.name), "New Subject"),
			color: "#1eff05",
		})
	}).then(async () => {
		console.log("Created new Subject")
		await queryClient.invalidateQueries({queryKey: ["subjects"]})
	}).catch((error) => {
		console.error("Create Subject", error)
		throw error
	})
}

function createPeriod(periods: Period[], queryClient: QueryClient): Promise<void> {
	return invoke("create_period_js", {
		json: JSON.stringify({
			id: -1,
			name: nextFree(periods.map(i => i.name), "New Period"),
			from: "2021-01-01",
			to: "2021-01-31",
		})
	}).then(async () => {
		console.log("Created new Period")
		await queryClient.invalidateQueries({queryKey: ["periods"]})
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