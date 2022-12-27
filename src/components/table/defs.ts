import {ReactNode} from "react";


type Column<Row extends IRow> = {
	data: Row
	edit: boolean
	temp: Row
}

interface IRow {
	id: number
}

interface ColumnDef<Row extends IRow> {
	format?: (row: Row) => ReactNode | Row[keyof Row]
	// function returning elements to be displayed instead of the data, with event listeners to update the row
	edit?: (row: Row, update: () => void) => ReactNode
	// processes the data before it is used for sorting (dates)
	preSort?: (row: Row) => any
	hide?: boolean
	name?: string
	sort: boolean
}

type cols<Row extends IRow> = Map<keyof Row, ColumnDef<Row>>


export type {
	cols,
	ColumnDef,
	Column,
	IRow,
	ReactNode
}