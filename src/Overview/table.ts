import {Grade} from "../entity/grade";
import {HeadCell} from "../components/table/table";

const headCells: HeadCell<Grade>[] = [
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