import {Dispatch, SetStateAction, useState} from "react";

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

function convertWeight(weight: 'Default' | 'Double' | 'Half') {
	switch (weight) {
		case 'Default':
			return ""
		case 'Double':
			return "x2"
		case 'Half':
			return "/2"
	}
}


export type {
	reactSet,
}

export {
	nextFree,
	capitalizeFirstLetter,
	map,
	nullableUseState,
	randColor,
	convertWeight
}