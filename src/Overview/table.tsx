import {Grade, Subject, Type} from "../entity";
import {ReactElement} from "react";

type TableGrade = {
	id: number,
	subject: string,
	type: string,
	info: string,
	grade: number,
	extra: ReactElement
}

function transform(grades: Grade[], subjects: Subject[], types: Type[]): TableGrade[] {
	return grades.map(grade => ({
				id: grade.id,
				subject: subjects.find(sub => sub.id === grade.subject)?.name || '--notfound--',
				type: types.find(type => type.id === grade.type)?.name || '--notfound',
				info: grade.info,
				grade: grade.grade,
				extra: (<>x2: {grade.double ? <>&#9745;</> : <>&#9744;</>}&nbsp;&nbsp;not_final: {grade.not_final ? <>&#9745;</> : <>&#9744;</>}</>)
			})
	)
}

export {
	transform
};
export type {
	TableGrade
};
