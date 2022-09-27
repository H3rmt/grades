import * as React from 'react';
import {useEffect, useState} from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {Table} from "@mui/material";
import {Grade} from "../entity/grade";
import {getComparator, Order, setSort} from "./sort";
import {headCells} from "./table";
import {loadGrades} from "./load";

export default function Overview() {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof Grade>('id');

	const [grades, setGrades] = useState<Grade[]>([]);


	const handleRequestSort = (
			property: keyof Grade,
	) => {
		const [newOrder, newOrderBy] = setSort(property, order, orderBy)
		setOrder(newOrder)
		setOrderBy(newOrderBy)
	};

	const getGrades = () => {
		// @ts-ignore
		loadGrades().then((data) => {
			setGrades(data)
		}).catch(() => {
			setGrades([])
			// TODO display error
		})

		console.log("loaded grades")
	}

	useEffect(() => {
		getGrades()
	}, [])

	return (<>
		<TableContainer sx={{overflowY: 'auto'}} component="div">
			<Table size="medium">
				<TableHead sx={{bgcolor: "primary.main"}}>
					<TableRow>
						{headCells.map((headCell) => (
								<TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}
											  sx={{backgroundColor: "inherit"}}>
									<TableSortLabel
											active={orderBy === headCell.id}
											direction={orderBy === headCell.id ? order : 'asc'}
											onClick={() => handleRequestSort(headCell.id)}>
										{headCell.label}
									</TableSortLabel>
								</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{grades.slice().sort(getComparator(order, orderBy))
							.map((grade) => {
								return (<TableRow hover key={grade.id}>
									<TableCell>{grade.subject}</TableCell>
									<TableCell>{grade.type}</TableCell>
									<TableCell>{grade.grade}</TableCell>
									<TableCell>{grade.info}</TableCell>
								</TableRow>);
							})}
				</TableBody>
			</Table>
		</TableContainer>
	</>);
}