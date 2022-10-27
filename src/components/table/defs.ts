import {ReactNode} from "react";


type RowD<Row> = {
	data: Row
	edit: boolean
	temp: Row
}

interface IRow {
	id: number
}

interface Column<Row> {
	format?: format<Row>
	// function returning elements to be displayed instead of the data, with event listeners to update the row
	edit?: (row: Row) => ReactNode
	hide?: boolean
	name?: string
	sort: boolean
}

type cols<Row> = Map<keyof Row, Column<Row>>

type format<Row> = (data: Row[keyof Row]) => ReactNode | Row[keyof Row]


export type {
	cols,
	format,
	Column,
	RowD,
	IRow,
	ReactNode
}