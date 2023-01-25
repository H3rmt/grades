import {ReactNode} from "react";

export type IRow = {
	id: number
} // & { [key: symbol]: ReactNode }

export type Column<Row extends IRow> = {
	data: Row
	edit: boolean
	dialogOpen: boolean
	temp: Row
}

export type ColumnDef<Row extends IRow> =
		ColumnDefNoEdit<Row> | ColumnDefEdit<Row> |
		ColumnDefExtraEdit<Row> | ColumnDefExtraShow<Row> |
		ColumnDefHidden<Row>

export type ColumnDefDefault<Row extends IRow> = {
	format?: (row: Row) => ReactNode
	// processes the data before it is used for sorting (dates)
	preSort?: (row: Row) => unknown
	name?: string
	sort?: boolean
}

export type ColumnDefNoEdit<Row extends IRow> = {
	edit?: undefined
	extraEdit?: undefined | false
	extraShow?: undefined | false
	hide?: undefined | false
} & ColumnDefDefault<Row>

export type ColumnDefEdit<Row extends IRow> = {
	// function returning elements to be displayed instead of the data, with event listeners to update the row
	edit: (row: Row, update: () => void) => ReactNode
	extraEdit?: undefined | false
	extraShow?: undefined | false
	hide?: undefined | false
} & ColumnDefDefault<Row>

export type ColumnDefExtraEdit<Row extends IRow> = {
	// function returning elements to be displayed instead of the data, with event listeners to update the row
	edit: (row: Row, update: () => void) => ReactNode
	extraEdit: true
	extraShow?: undefined | false
	hide?: true | false
} & ColumnDefDefault<Row>

export type ColumnDefExtraShow<Row extends IRow> = {
	// function returning elements to be displayed instead of the data, with event listeners to update the row
	edit?: undefined
	extraEdit?: undefined | false
	extraShow: true
	hide: true
} & ColumnDefDefault<Row>

export type ColumnDefHidden<Row extends IRow> = {
	edit?: undefined
	extraEdit?: undefined | false
	extraShow?: undefined | false
	hide: true
} & ColumnDefDefault<Row>


export type Cols<Row extends IRow> = Map<keyof Row, ColumnDef<Row>>