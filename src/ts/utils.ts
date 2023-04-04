import {useState} from 'react'

export function useUndefinedState<T>() {
	return useState<T | undefined>(undefined)
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	return ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

export function nextFree(arr: string[], name: string) {
	let i = 1
	let newName = name
	while (arr.includes(newName)) {
		newName = name + ' ' + i
		i++
	}
	return newName
}

export function randColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

export function sleep(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time))
}