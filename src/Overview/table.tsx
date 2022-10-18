import {Grade, Subject, Type} from "../entity";
import {ReactElement} from "react";
import {Typography} from "@mui/material";
import {map} from "../ts/utils";

type TableGrade = {
	id: number,
	subject: string,
	type: string,
	info: string,
	grade: ReactElement,
	extra: ReactElement
}

function transform(grades: Grade[], subjects: Subject[], types: Type[]): TableGrade[] {
	return grades.map(grade => ({
				id: grade.id,
				subject: subjects.find(sub => sub.id === grade.subject)?.name || '--notfound--',
				type: types.find(type => type.id === grade.type)?.name || '--notfound',
				info: grade.info,
				grade: (<Typography color={`rgb(
						${map(grade.grade, 0, 15, 230, 40)},
						${map(grade.grade, 0, 15, 40, 230)},
						${0}
				)`}>{grade.grade}</Typography>),
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
