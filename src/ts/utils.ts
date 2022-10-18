import {Dispatch, SetStateAction} from "react";

type reactSet<T> = Dispatch<SetStateAction<T>>

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	return ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export type {
	reactSet,
}

export {
	capitalizeFirstLetter,
	map
}