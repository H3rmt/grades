import {Grade, Subject, Type} from "../entity";
import {cols, Column} from "../components/table/table";
import {Checkbox, FormControlLabel, TextField, Typography} from "@mui/material";
import {map} from "../ts/utils";
import React from "react";
import {NoteRange} from "../entity/config";

type CustomGrade = {
	id: number
	subject: string,
	type: string,
	info: string,
	grade: number,
	extra: [boolean, boolean],
}

const getCols: (noteRange: NoteRange) => cols<CustomGrade> = (noteRange: NoteRange) => new Map<keyof CustomGrade, Column<CustomGrade>>(
		[[
			"grade", {
				sort: true,
				format: grade => <Typography
						color={`rgb(${map(grade as number, 0, 15, 230, 40)},${map(grade as number, 0, 15, 40, 230)},0)`}>{grade}</Typography>,
				edit: (r) => <TextField value={r.grade}
												onChange={(i) => r.grade = Math.max(Math.min(Number(i.target.value), noteRange?.to), noteRange?.from)}/>
			}
		], [
			"subject", {
				sort: true,
				edit: (r) => <Typography>{r.subject}</Typography>
			}
		], [
			"type", {
				sort: true,
				edit: (r) => <Typography>{r.type}</Typography>
			}
		], [
			"info", {
				sort: true,
				edit: (r) => <TextField value={r.info} onChange={(i) => r.info = i.target.value}/>
			}
		], [
			"extra", {
				sort: false,
				format: extra => (<>x2:&nbsp;{(extra as boolean[])[0] ? <>&#9745;</> : <>&#9744;</>}&nbsp;&nbsp;not_final:&nbsp;{(extra as boolean[])[1] as boolean ? <>&#9745;</> : <>&#9744;</>}</>),
				edit: (r) => <>
					<FormControlLabel control={
						<Checkbox color="secondary" checked={r.extra[0]} onChange={i => r.extra[0] = i.target.checked}/>
					} label="Count x2"/>
					<FormControlLabel control={
						<Checkbox color="secondary" checked={r.extra[1]} onChange={i => r.extra[1] = i.target.checked}/>
					} label="Not Final"/>
				</>
			}
		], [
			"id", {
				sort: true,
				hide: true
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