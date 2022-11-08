import {Grade, Subject, Type} from "../entity";
import {cols, Column} from "../components/table/defs";
import {Checkbox, TextField, Typography} from "@mui/material";
import {map} from "../ts/utils";
import React from "react";
import {NoteRange} from "../entity/config";


const getCols: (noteRange: NoteRange, subjects: Subject[], types: Type[]) => cols<Grade> = (noteRange: NoteRange, subjects: Subject[], types: Type[]) => new Map<keyof Grade, Column<Grade>>(
		[[
			"grade", {
				sort: true,
				format: grade => <Typography
						color={`rgb(${map(grade as number, 0, 15, 230, 40)},${map(grade as number, 0, 15, 40, 230)},0)`}>{grade}</Typography>,
				edit: (r) => <TextField fullWidth value={r.grade}
												onChange={(i) => r.grade = Math.max(Math.min(Number(i.target.value), noteRange?.to), noteRange?.from)}/>
			}
		], [
			"subject", {
				sort: true,
				format: subject => <Typography
						sx={{color: subjects.find(sub => sub.id === subject)?.color || 'white'}}>{subjects.find(sub => sub.id === subject)?.name || '--notfound--'}</Typography>,
			}
		], [
			"type", {
				sort: true,
				format: type => <Typography
						sx={{color: types.find(typ => typ.id === type)?.color || 'white'}}>{subjects.find(typ => typ.id === type)?.name || '--notfound--'}</Typography>,

			}
		], [
			"info", {
				sort: true,
				edit: (r) => <TextField fullWidth value={r.info} onChange={(i) => r.info = i.target.value}/>
			}
		], [
			"double", {
				sort: false,
				format: double => <Checkbox checked={double as boolean} disabled/>,
				edit: (r) => <Checkbox color="secondary" checked={r.double} onChange={i => r.double = i.target.checked}/>
			}
		], [
			"not_final", {
				sort: false,
				name: "Not Final",
				format: notFinal => <Checkbox checked={notFinal as boolean} disabled/>,
				edit: (r) => <Checkbox color="secondary" checked={r.not_final} onChange={i => r.not_final = i.target.checked}/>
			}
		], [
			"id", {
				sort: true,
				hide: true
			}
		], [
			"period", {
				sort: true,
				hide: true
			}
		]]
)

export {
	getCols
};