import {HeadCell} from "../components/table/table";
import {Grade, Subject, Type} from "../entity";

type TableGrade = {
	id: number,
	subject: string,
	type: string,
	info: string,
	grade: number,
	not_final: boolean,
	double: boolean
}

const header: HeadCell<TableGrade>[] = [
	{
		id: 'subject',
		label: 'Subject',
	},
	{
		id: 'type',
		label: 'Type',
	},
	{
		id: 'grade',
		label: 'Grade',
	},
	{
		id: 'info',
		label: 'Info',
	}
];

function transform(grades: Grade[], subjects: Subject[], types: Type[]): TableGrade[] {
	return grades.map(grade => ({
				id: grade.id,
				subject: subjects.find(sub => sub.id === grade.subject)?.name || '--notfound--',
				type: types.find(type => type.id === grade.type)?.name || '--notfound',
				info: grade.info,
				grade: grade.grade,
				not_final: grade.not_final,
				double: grade.double
			})
	)
}

export {
	header,
	transform
};
export type {
	TableGrade
};
