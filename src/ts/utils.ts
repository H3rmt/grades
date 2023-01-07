import {Dispatch, SetStateAction, useState} from "react";

export type reactSet<T> = Dispatch<SetStateAction<T>>

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

export function randColor(): string {
	return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

export function convertWeight(weight: 'Default' | 'Double' | 'Half') {
	switch (weight) {
		case 'Default':
			return ""
		case 'Double':
			return "x2"
		case 'Half':
			return "/2"
	}
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
	randColor,
}