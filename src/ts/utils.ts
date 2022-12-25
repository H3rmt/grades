import {Dispatch, SetStateAction, useState} from "react";
import {UseQueryOptions} from "@tanstack/react-query/src/types";
import {QueryKey} from "@tanstack/query-core/src/types";
import {UseMutationOptions} from "@tanstack/react-query";
import {invoke as inv} from "@tauri-apps/api/tauri";

type reactSet<T> = Dispatch<SetStateAction<T>>

function nullableUseState<T>() {
	return useState<T | null>(null)
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	return ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function nextFree(arr: string[], name: string) {
	let i = 1
	let newName = name
	while (arr.includes(newName)) {
		newName = name + " " + i
		i++
	}
	return newName
}

function randColor(): string {
	return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

function create<T>(cmd: string, args?: any): Promise<void> { // change to Promise<T> if id returned
	return inv("create_" + cmd + "_js", {json: JSON.stringify(args)}).then(() => {
		// return id
		console.debug("create_" + cmd, "success", args)
	}).catch((e) => {
		console.debug("create_" + cmd, "fail", e, args)
		throw e
	})
}

function del(cmd: string, id: any): Promise<void> {
	return inv("delete_" + cmd + "_js", {json: JSON.stringify({id: id})}).then(() => {
		console.debug("delete_" + cmd, "success", id)
	}).catch((e) => {
		console.debug("delete_" + cmd, "fail", e, id)
		throw e
	})
}

function edit<T>(cmd: string, args: any): Promise<void> { // change to Promise<T> if entity returned
	return inv("edit_" + cmd + "_js", {json: JSON.stringify(args)}).then(() => {
		// return entity
		console.debug("edit_" + cmd, "success", args)
	}).catch((e) => {
		console.debug("edit_" + cmd, "fail", e, args)
		throw e
	})
}

function get<T>(cmd: string): Promise<T> {
	return inv<string>("get_" + cmd + "_js").then((data: string) => {
		console.debug("get_" + cmd, "success")
		return JSON.parse(data)
	}).catch((e) => {
		console.debug("get_" + cmd, "fail", e)
		throw e
	})
}

type UseQueryOpts<
		TQueryFnData = unknown,
		TData = TQueryFnData,
		TQueryKey extends QueryKey = QueryKey,
> = Omit<
		UseQueryOptions<TQueryFnData, unknown, TData, TQueryKey>,
		'queryKey' | 'initialData'
> & { initialData?: TQueryFnData | (() => TQueryFnData) }

type UseMutationOpts<
		TData = unknown,
		TVariables = void,
		TContext = unknown
> = Omit<
		UseMutationOptions<TData, unknown, TVariables, TContext>,
		'mutationFn' | 'mutationKey'
>

export type {
	reactSet,
	UseQueryOpts,
	UseMutationOpts
}

export {
	nextFree,
	capitalizeFirstLetter,
	map,
	nullableUseState,
	edit,
	get,
	create,
	del,
	randColor
}