import {Key, ReactNode, useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {getComparator, Order, setSort} from "./sort";
import {Table} from "@mui/material";
import {capitalizeFirstLetter} from "../../ts/utils";

type Props<Row extends IRow> = {
	data: Row[]
	cols: cols<Row>
}

interface IRow {
	id: number
}

type cols<Row> = Map<keyof Row, format<Row> | undefined>

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
							{Array.from(props.cols.keys()).filter(col => col != "id").map((col) => {
								return <TableCell key={col as Key} sortDirection={orderBy === col ? order : false}
														sx={{backgroundColor: "inherit"}}>
									<TableSortLabel
											active={orderBy === col}
											direction={orderBy === col ? order : 'asc'}
											onClick={() => handleRequestSort(col)}>
										{col as ReactNode || capitalizeFirstLetter(col as string)}
									</TableSortLabel>
								</TableCell>
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{props.data.slice().sort(getComparator<Row>(order, orderBy)).map((grade) => {
							return <TableRow hover key={grade.id}>
								{Array.from(props.cols.entries()).filter(col => col[0] != "id").map((entry: [keyof Row, format<Row> | undefined]) => {
									const [key, format] = entry
									let f = format ?? ((t) => t)
									return <TableCell>{f(grade[key]) as ReactNode}</TableCell>
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
	format
}