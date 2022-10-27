import {Key, ReactNode, useCallback, useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {getComparator, Order, setSort} from "./sort";
import {IconButton, Stack, Table} from "@mui/material";
import {capitalizeFirstLetter} from "../../ts/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveButton from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';

type Props<Row extends IRow> = {
	data: RowD<Row>[]
	cols: cols<Row>
	delete?: (id: number) => void
	edit?: (row: Row) => void
}

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
	sort: boolean
}

type cols<Row> = Map<keyof Row, Column<Row>>

type format<Row> = (data: Row[keyof Row]) => ReactNode | Row[keyof Row]

export function CTable<Row extends IRow>(props: Props<Row>) {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof Row>('id');

	const [, updateState] = useState<object>();
	const forceUpdate = useCallback(() => updateState({}), []);

	const handleRequestSort = (property: keyof Row,) => {
		const [newOrder, newOrderBy] = setSort(property, order, orderBy)
		setOrder(newOrder)
		setOrderBy(newOrderBy)
	};

	return <TableContainer sx={{overflowY: 'auto'}} component="div">
		<Table size="medium">
			<TableHead sx={{bgcolor: "primary.main"}}>
				<TableRow>
					{
							(props.delete || props.edit) && <TableCell key="actions" padding="checkbox"/>
					}
					{Array.from(props.cols.entries()).filter(col => col[0] != "id").map(([key, col]) => {
						return <TableCell key={key as Key} sortDirection={orderBy === key ? order : false}
												sx={{backgroundColor: "inherit"}}>
							{
								col.sort ? <TableSortLabel
										active={orderBy === key}
										direction={orderBy === key ? order : 'asc'}
										onClick={() => handleRequestSort(key)}>
									{capitalizeFirstLetter(key as string)}
								</TableSortLabel> : capitalizeFirstLetter(key as string)
							}
						</TableCell>
					})}
				</TableRow>
			</TableHead>
			<TableBody>
				{props.data.slice().sort(getComparator<Row>(order, orderBy)).map((grade) => {
					return <TableRow hover key={grade.data.id}>
						{(props.delete || props.edit) && <TableCell>
							<Stack direction="row">
								{grade.edit ?
										<IconButton color="error" onClick={() => {
											grade.edit = false
											forceUpdate();
										}}><UndoIcon/>
										</IconButton>
										:
										props.delete && <IconButton color="error" onClick={() => {
											props.delete && props.delete(grade.data.id)
											forceUpdate();
										}}><DeleteIcon/>
										</IconButton>
								}
								{grade.edit ?
										<IconButton color="success" onClick={() => {
											grade.edit = false
											grade.data = {...grade.temp}
											forceUpdate();
											// @ts-ignore
											props.edit(grade.data)
										}}><SaveButton/>
										</IconButton>
										:
										props.edit && <IconButton color="default" onClick={() => {
											grade.edit = true
											grade.temp = {...grade.data}
											forceUpdate();
										}}><EditIcon/>
										</IconButton>
								}
							</Stack>
						</TableCell>
						}
						{Array.from(props.cols.entries()).filter(([, col]) => !col.hide).map((entry: [keyof Row, Column<Row>]) => {
							const [key, row] = entry
							let format = row.format ?? ((t) => t)
							let edit = row.edit ?? (() => "not supported")
							let e = edit(grade.temp)
							return grade.edit ?
									<TableCell key={key as Key} onChange={forceUpdate}>
										{e}
									</TableCell>
									:
									<TableCell key={key as Key}>
										{format(grade.data[key]) as ReactNode}
									</TableCell>
						})}
					</TableRow>;
				})}
			</TableBody>
		</Table>
	</TableContainer>;
}

export type {
	IRow,
	cols,
	Column,
	format,
	RowD
}