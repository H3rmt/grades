import {Grade} from "../entity/grade";

type HeadCell = {
	disablePadding: boolean;
	id: keyof Grade;
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

export {
	headCells
}

export type {
	HeadCell
}

