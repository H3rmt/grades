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
import {cols, ColumnDef, IRow, Column} from "./defs";

type Props<Row extends IRow> = {
	data: Array<Row>
	cols: cols<Row>
	delete?: (id: number) => void
	edit?: (row: Row) => void
}

export function CTable<Row extends IRow>(props: Props<Row>) {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof Row>('id');

	const [, updateState] = useState<object>();
	const forceUpdate = useCallback(() => updateState({}), []);

	const [data, setData] = useState<Map<number, Column<Row>>>(new Map())

	let change = false

	// remove deleted rows
	for (const col of data.values()) {
		if (props.data.find(row => row.id === col.data.id) === undefined) {
			data.delete(col.data.id)
			change = true
		}
	}

	for (const col of props.data) {
		let co = data.get(col.id)
		// update existing rows
		if (co) {
			co.data = col
		} else {
			// add new rows
			data.set(col.id, {data: col, edit: false, temp: {...col}});
			change = true
		}
	}

	// check
	if (change) {
		setData(data)
	}

	const handleRequestSort = (property: keyof Row) => {
		const [newOrder, newOrderBy] = setSort(property, order, orderBy)
		setOrder(newOrder)
		setOrderBy(newOrderBy)
	};

	return <TableContainer sx={{overflowY: 'auto'}} component="div">
		<Table size="medium">
			<TableHead sx={{bgcolor: "primary.main"}}>
				<TableRow>
					{(props.delete ?? props.edit) && <TableCell key="actions" padding="checkbox"/>}
					{Array.from(props.cols.entries()).filter(([, col]) => !col.hide).map(([key, col]) => {
						return <TableCell key={key as Key} sortDirection={orderBy === key ? order : false}
												sx={{backgroundColor: "inherit"}}>
							{
								col.sort ?
										<TableSortLabel
												active={orderBy === key}
												direction={orderBy === key ? order : 'asc'}
												onClick={() => handleRequestSort(key)}>
											{col.name ?? capitalizeFirstLetter(key as string)}
										</TableSortLabel>
										:
										col.name ?? capitalizeFirstLetter(key as string)
							}
						</TableCell>
					})}
				</TableRow>
			</TableHead>
			<TableBody>
				{[...data.values()].sort(getComparator<Row>(order, orderBy, props.cols.get(orderBy)?.preOrder)).map((col) => {
					return <TableRow hover key={col.data.id}>
						{(props.delete ?? props.edit) && <TableCell>
							<Stack direction="row">
								{col.edit ?
										<IconButton color="default" onClick={() => {
											col.edit = false
											setData(new Map(data));
										}}><UndoIcon/>
										</IconButton>
										:
										props.delete && <IconButton color="error" onClick={() => {
											props.delete && props.delete(col.data.id)
											data.delete(col.data.id)
											setData(new Map(data));
										}}><DeleteIcon/>
										</IconButton>
								}
								{col.edit ?
										<IconButton color="success" onClick={() => {
											col.edit = false
											col.data = {...col.temp}
											props.edit && props.edit(col.data)
											setData(new Map(data));
										}}><SaveButton/>
										</IconButton>
										:
										props.edit && <IconButton color="default" onClick={() => {
											col.edit = true
											col.temp = {...col.data}
											setData(new Map(data))
										}}><EditIcon/>
										</IconButton>
								}
							</Stack>
						</TableCell>
						}
						{Array.from(props.cols.entries()).filter(([, col]) => !col.hide).map((entry: [keyof Row, ColumnDef<Row>]) => {
							const [key, row] = entry
							let format = row.format ?? (() => col.data[key])
							let edit = (row.edit ?? (() => format(col.data)))
							return col.edit ?
									<TableCell key={key as Key} onChange={() => {
										forceUpdate()
									}}>
										{edit(col.temp, forceUpdate) as ReactNode}
									</TableCell>
									:
									<TableCell key={key as Key}>
										{format(col.data) as ReactNode}
									</TableCell>
						})}
					</TableRow>;
				})}
			</TableBody>
		</Table>
	</TableContainer>
			;
}

export type {
	IRow,
	cols,
	ColumnDef,
	Column
}