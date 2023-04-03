import {ReactNode} from 'react'

export type IRow = {
	id: number
} // & { [key: symbol]: ReactNode }

export type Column<Row extends IRow> = {
	data: Row
	edit: boolean
	dialogOpen: boolean
	temp: Row
}

export type ColumnDefs<Row extends IRow> =
		ColumnDefNoEdit<Row> | ColumnDefEdit<Row> |
		ColumnDefExtraEdit<Row> | ColumnDefExtraShow<Row> |
		ColumnDefHidden<Row> | ColumnDefEditAndExtraEdit<Row> |
		ColumnDefShowAndExtraShow<Row>

export type ColumnDef<Row extends IRow> = {
	format?: (row: Row) => ReactNode
	// processes the data before it is used for sorting (dates)
	preSort?: (row: Row) => NonNullable<unknown>
	name?: string
	sort?: boolean
}

export type ColumnDefBase<Row> = {
	edit?: undefined | ((row: Row, update: () => void) => ReactNode)
	extraEdit?: undefined | ((row: Row, update: () => void) => ReactNode)
	extraShow?: undefined | false | true
	hide?: undefined | false | true
}

/**
 * just show in table, not in edit dialog
 */
export interface ColumnDefNoEdit<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit?: undefined
	extraEdit?: undefined
	extraShow?: false | true
	hide?: false | true
}

/**
 * edit in table, but not in edit dialog
 */
export interface ColumnDefEdit<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit: (row: Row, update: () => void) => ReactNode
	extraEdit?: undefined
	extraShow?: false
	hide?: false
}

/**
 * edit in edit dialog, but not in table
 */
export interface ColumnDefExtraEdit<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit?: undefined
	extraEdit: (row: Row, update: () => void) => ReactNode
	extraShow?: false
	hide?: false | true
}

/**
 * edit in table and in edit dialog (2 different edits)
 */
export interface ColumnDefEditAndExtraEdit<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit: (row: Row, update: () => void) => ReactNode
	extraEdit: (row: Row, update: () => void) => ReactNode
	extraShow?: false
	hide?: false
}

/**
 * show in edit dialog, but not in table (id in settings), but no edit
 */
export interface ColumnDefExtraShow<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit?: undefined
	extraEdit?: undefined
	extraShow: true
	hide?: false
}

/**
 * show in edit dialog and in table, but no edit
 */
export interface ColumnDefShowAndExtraShow<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit?: undefined
	extraEdit?: undefined
	extraShow: true
	hide?: true
}

/**
 * don't show in table (id, etc.)
 */
export interface ColumnDefHidden<Row extends IRow> extends ColumnDefBase<Row>, ColumnDef<Row> {
	edit?: undefined
	extraEdit?: undefined
	extraShow?: undefined
	hide: true
}


export type Cols<Row extends IRow> = Map<keyof Row, ColumnDefs<Row>>