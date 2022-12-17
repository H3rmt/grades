import {ReactNode} from "react";


type Column<Row> = {
	data: Row
	edit: boolean
	temp: Row
}

interface IRow {
	id: number
}

interface ColumnDef<Row> {
	format?: (row: Row) => ReactNode | Row[keyof Row]
	// function returning elements to be displayed instead of the data, with event listeners to update the row
	edit?: (row: Row, update: () => void) => ReactNode
	hide?: boolean
	name?: string
	sort: boolean
}

type cols<Row> = Map<keyof Row, ColumnDef<Row>>


export type {
	cols,
	ColumnDef,
	Column,
	IRow,
	ReactNode
}