import * as React from "react";
import {useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {getComparator, Order, setSort} from "./sort";
import {Table} from "@mui/material";
import {capitalizeFirstLetter} from "../../ts/utils";

type Props<Type extends Data> = {
	headers?: (keyof Type)[]
	data: Type[]
}

interface Data {
	id: number
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

	let defs: (keyof Type)[]
	if (props.headers == null) {
		// @ts-ignore
		defs = Object.getOwnPropertyNames(props.data[0])
	} else {
		defs = props.headers
	}

	return (<TableContainer sx={{overflowY: 'auto'}} component="div">
				<Table size="medium">
					<TableHead sx={{bgcolor: "primary.main"}}>
						<TableRow>
							{defs.map((head) => {
								//@ts-ignore
								let h: string = head
								return <TableCell key={h} sortDirection={orderBy === head ? order : false}
														sx={{backgroundColor: "inherit"}}>
									<TableSortLabel
											active={orderBy === head}
											direction={orderBy === head ? order : 'asc'}
											onClick={() => handleRequestSort(head)}>
										{capitalizeFirstLetter(h)}
									</TableSortLabel>
								</TableCell>
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{// @ts-ignore
							props.data.slice().sort(getComparator(order, orderBy)).map((grade) => {
								return (<TableRow hover key={grade.id}>
									{defs.map((cell) => {
										// @ts-ignore
										return <TableCell>{grade[cell]}</TableCell>
									})}
								</TableRow>);
							})}
					</TableBody>
				</Table>
			</TableContainer>
	);
}

export type {
	Data
}