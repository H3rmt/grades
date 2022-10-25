import {Grade, Subject, Type} from "../entity";
import {cols, Column} from "../components/table/table";
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

const getCols: () => cols<CustomGrade> = () => new Map<keyof CustomGrade, Column<CustomGrade>>(
		[[
			"grade", {
				sort: true,
				format: grade => <Typography
						color={`rgb(${map(grade as number, 0, 15, 230, 40)},${map(grade as number, 0, 15, 40, 230)},0)`}>{grade}</Typography>
			}
		], [
			"subject", {
				sort: true
			}
		], [
			"type", {
				sort: true
			}
		], [
			"info", {
				sort: true
			}
		], [
			"extra", {
				sort: false,
				format: extra => (<>x2:&nbsp;{(extra as boolean[])[0] ? <>&#9745;</> : <>&#9744;</>}&nbsp;&nbsp;not_final:&nbsp;{(extra as boolean[])[1] as boolean ? <>&#9745;</> : <>&#9744;</>}</>)
			}
		], [
			"id", {
				sort: true
			}
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