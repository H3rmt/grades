import * as React from 'react';
import {useState} from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {Box, Table} from "@mui/material";

interface Data {
	id: number
	grade: number
	subject: string
	type: string
	info: string
}

const rows: Data[] = [
	{
		id: 1,
		grade: 12,
		info: "none",
		subject: "sub",
		type: "tyPe"
	}, {
		id: 2,
		grade: 8,
		info: "info",
		subject: "sub2",
		type: "TyPe2"
	}, {
		id: 3,
		grade: 9,
		info: "info2",
		subject: "sub3",
		type: "TyPe2"
	}, {
		id: 4,
		grade: 9,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 5,
		grade: 11,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}, {
		id: 6,
		grade: 10,
		info: "infooo",
		subject: "sub",
		type: "TyPe"
	}
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
		order: Order,
		orderBy: Key,
): (
		a: { [key in Key]: number | string },
		b: { [key in Key]: number | string },
) => number {
	return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{
		id: 'subject',
		numeric: false,
		disablePadding: false,
		label: 'Subject',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'Type',
	},
	{
		id: 'grade',
		numeric: true,
		disablePadding: false,
		label: 'Grade',
	},
	{
		id: 'info',
		numeric: false,
		disablePadding: false,
		label: 'Info',
	}
];


export default function Overview() {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof Data>('id');

	const handleRequestSort = (
			property: keyof Data,
	) => {
		if (orderBy === property) {
			if (order === 'desc') {
				// "disable Sort"
				setOrder('asc')
				setOrderBy("id")
			} else {
				setOrder('desc')
				setOrderBy(property);
			}
		} else {
			setOrder('asc')
			setOrderBy(property);
		}
	};

	return (<Box>
		Analysis<br/>Analysis<br/>Analysis<br/>
		Analysis<br/>Analysis<br/>Analysis<br/>
		<TableContainer>
			<Table size="medium">
				<TableHead sx={{bgcolor: "primary.main"}}>
					<TableRow>
						{headCells.map((headCell) => (
								<TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false} sx={{backgroundColor: "inherit"}}>
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
					{rows.slice().sort(getComparator(order, orderBy))
							.map((row) => {
								return (<TableRow hover key={row.id}>
									<TableCell>{row.subject}</TableCell>
									<TableCell>{row.type}</TableCell>
									<TableCell>{row.grade}</TableCell>
									<TableCell>{row.info}</TableCell>
								</TableRow>);
							})}
				</TableBody>
			</Table>
		</TableContainer>
	</Box>);
}