import {Dispatch, SetStateAction, useState} from "react";
import {UseQueryOptions} from "@tanstack/react-query/src/types";
import {QueryKey} from "@tanstack/query-core/src/types";
import {UseMutationOptions} from "@tanstack/react-query";

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

type UseQueryOpts<
		TQueryFnData = unknown,
		TData = TQueryFnData,
		TQueryKey extends QueryKey = QueryKey,
> = Omit<
		UseQueryOptions<TQueryFnData, unknown, TData, TQueryKey>,
		'initialData' | 'queryKey'
> & { initialData?: () => undefined }

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
}