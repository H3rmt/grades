import {Grade, Subject, Type} from "../entity";
import {cols, format} from "../components/table/table";
import {Typography} from "@mui/material";
import {map} from "../ts/utils";

type CustomGrade = {
	id: number
	subject: string,
	type: string,
	info: string,
	grade: number,
	extra: [boolean, boolean],
}

const getCols: () => cols<CustomGrade> = () => new Map<keyof CustomGrade, format<CustomGrade> | undefined>(
		[[
			"grade",
			grade => <Typography
					color={`rgb(${map(grade as number, 0, 15, 230, 40)},${map(grade as number, 0, 15, 40, 230)},0)`}>{grade}</Typography>
		], [
			"subject", undefined
		], [
			"type", undefined
		], [
			"info", undefined
		], [
			"extra", extra => (<>x2: {(extra as boolean[])[0] ? <>&#9745;</> : <>&#9744;</>}&nbsp;&nbsp;not_final: {(extra as boolean[])[1] as boolean ? <>&#9745;</> : <>&#9744;</>}</>)
		], [
			"id", undefined
		]]
)


function transform(grades: Grade[], subjects: Subject[], types: Type[]): CustomGrade[] {
	return grades.map(grade => ({
				id: grade.id,
				subject: subjects.find(sub => sub.id === grade.subject)?.name || '--notfound--',
				type: types.find(type => type.id === grade.type)?.name || '--notfound',
				info: grade.info,
				grade: grade.grade,
				extra: [grade.double, grade.not_final]
			})
	)
}


export {
	getCols,
	transform
};