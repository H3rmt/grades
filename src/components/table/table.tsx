import {Key, ReactNode, useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {getComparator, Order, setSort} from "./sort";
import { IconButton, Table} from "@mui/material";
import {capitalizeFirstLetter} from "../../ts/utils";
import DeleteIcon from '@mui/icons-material/Delete';

type Props<Row extends IRow> = {
	data: Row[]
	cols: cols<Row>
	delete?: (row: number) => void
}

interface IRow {
	id: number
}

interface Column<Row> {
	format?: format<Row>
	sort: boolean
}

type cols<Row> = Map<keyof Row, Column<Row>>

type format<Row> = (data: Row[keyof Row]) => ReactNode | Row[keyof Row]

export function CTable<Row extends IRow>(props: Props<Row>) {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof Row>('id');

	const handleRequestSort = (property: keyof Row,) => {
		const [newOrder, newOrderBy] = setSort(property, order, orderBy)
		setOrder(newOrder)
		setOrderBy(newOrderBy)
	};

	return (<TableContainer sx={{overflowY: 'auto'}} component="div">
				<Table size="medium">
					<TableHead sx={{bgcolor: "primary.main"}}>
						<TableRow>
							<TableCell key="actions" padding="checkbox">
							</TableCell>
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
							return <TableRow hover key={grade.id}>
								<TableCell>
									<IconButton  color="secondary" onClick={() => props.delete && props?.delete(grade.id)}>
										<DeleteIcon/>
									</IconButton >
								</TableCell>
								{Array.from(props.cols.entries()).filter(col => col[0] != "id").map((entry: [keyof Row, Column<Row>]) => {
									const [key, row] = entry
									let format = row.format ?? ((t) => t)
									return <TableCell key={key as Key}>{format(grade[key]) as ReactNode}</TableCell>
								})}
							</TableRow>;
						})}
					</TableBody>
				</Table>
			</TableContainer>
	);
}

export type {
	IRow,
	cols,
	Column,
	format
}