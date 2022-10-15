import * as React from "react";
import {Key, useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {getComparator, Order, setSort} from "./sort";
import {Table} from "@mui/material";

type Props<Type extends Data> = {
	headCells: HeadCell<Type>[]
	data: Type[]
}

interface Data {
	id: number
}

type HeadCell<Type extends Data> = {
	id: keyof Type
	label: string
}

export function CTable<Type extends Data>(props: Props<Type>) {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof Type>('id');

	const handleRequestSort = (
			property: keyof Type,
	) => {
		const [newOrder, newOrderBy] = setSort(property, order, orderBy)
		setOrder(newOrder)
		setOrderBy(newOrderBy)
	};

	return (<TableContainer sx={{overflowY: 'auto'}} component="div">
				<Table size="medium">
					<TableHead sx={{bgcolor: "primary.main"}}>
						<TableRow>
							{props.headCells.map((headCell) => {
								// @ts-ignore
								let key: Key = headCell.id as keyof Type
								return <TableCell key={key} sortDirection={orderBy === headCell.id ? order : false}
														sx={{backgroundColor: "inherit"}}>
									<TableSortLabel
											active={orderBy === headCell.id}
											direction={orderBy === headCell.id ? order : 'asc'}
											onClick={() => handleRequestSort(headCell.id)}>
										{headCell.label}
									</TableSortLabel>
								</TableCell>
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{// @ts-ignore
							props.data.slice().sort(getComparator(order, orderBy))
									.map((grade) => {
										return (<TableRow hover key={grade.id}>
											{props.headCells.map((cell) => {
												// @ts-ignore
												return <TableCell>{grade[cell.id]}</TableCell>
											})}
										</TableRow>);
									})}
					</TableBody>
				</Table>
			</TableContainer>
	);
}

export type {
	Data,
	HeadCell
}