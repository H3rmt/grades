import {cols, Column} from "../components/table/defs";
import {Period, Subject, Type} from "../entity";
import {Input, TextField, Typography} from "@mui/material";

const getTypeCols: () => cols<Type> = () => new Map<keyof Type, Column<Type>>(
		[[
			"name", {
				sort: true,
				edit: (r) => <TextField fullWidth value={r.name} onChange={(i) => r.name = i.target.value}/>
			}
		], [
			"color", {
				sort: false,
				format: (r) => <Typography sx={{color: r as string}}>{r}</Typography>,
				edit: (r) => <Input fullWidth type="color" value={r.color} onChange={(i) => r.color = i.target.value}/>
			}
		], [
			"id", {
				sort: true,
				hide: true
			}
		]]
)

const getSubjectCols: () => cols<Subject> = () => new Map<keyof Subject, Column<Subject>>(
		[[
			"name", {
				sort: true,
				edit: (r) => <TextField fullWidth value={r.name} onChange={(i) => r.name = i.target.value}/>
			}
		], [
			"color", {
				sort: false,
				format: (r) => <Typography sx={{color: r as string}}>{r}</Typography>,
				edit: (r) => <Input fullWidth type="color" value={r.color} onChange={(i) => r.color = i.target.value}/>
			}
		], [
			"id", {
				sort: true,
				hide: true
			}
		]]
)

const getPeriodCols: () => cols<Period> = () => new Map<keyof Period, Column<Period>>(
		[[
			"name", {
				sort: true,
				edit: (r) => <TextField fullWidth value={r.name} onChange={(i) => r.name = i.target.value}/>
			}
		], [
			"from", {
				sort: true,
				edit: (r) => <Input fullWidth type="date" value={r.from} onChange={(i) => r.from = i.target.value}/>
			}
		], [
			"to", {
				sort: true,
				edit: (r) => <Input fullWidth type="date" value={r.to} onChange={(i) => r.to = i.target.value}/>
			}
		], [
			"id", {
				sort: true,
				hide: true
			}
		]]
)

export {
	getPeriodCols,
	getSubjectCols,
	getTypeCols
};