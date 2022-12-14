import {useState} from "react";
import {invoke} from "@tauri-apps/api";

export function nullableUseState<T>() {
	return useState<T | null>(null)
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	return ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export function nextFree(arr: string[], name: string) {
	let i = 1
	let newName = name
	while (arr.includes(newName)) {
		newName = name + " " + i
		i++
	}
	return newName
}

export function randColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

export function edit<T>(cmd: string, args: any): Promise<void> { // change to Promise<T> if entity returned
	return invoke("edit_" + cmd + "_js", {json: JSON.stringify(args)}).then(() => {
		// return entity
		console.debug("edit_" + cmd, "success", args)
	}).catch((e) => {
		console.debug("edit_" + cmd, "fail", e, args)
		throw e
	})
}

export function reset<T>(cmd: string): Promise<void> {
	return invoke("reset_" + cmd + "_js").then(() => {
		console.debug("reset_" + cmd, "success")
	}).catch((e) => {
		console.debug("reset_" + cmd, "fail", e)
		throw e
	})
}

export function get<T>(cmd: string): Promise<T> {
	return invoke<string>("get_" + cmd + "_js").then((data: string) => {
		console.debug("get_" + cmd, "success")
		return JSON.parse(data)
	}).catch((e) => {
		console.debug("get_" + cmd, "fail", e)
		throw e
	})
}