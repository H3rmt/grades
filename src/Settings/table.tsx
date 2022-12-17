import {cols, ColumnDef} from "../components/table/defs";
import {Period, Subject, Type} from "../entity";
import {Input, TextField, Typography} from "@mui/material";

const getTypeCols: () => cols<Type> = () => new Map<keyof Type, ColumnDef<Type>>(
		[[
			"name", {
				sort: true,
				edit: (t) => <TextField fullWidth value={t.name} onChange={(i) => t.name = i.target.value}/>
			}
		], [
			"color", {
				sort: false,
				format: t => <Typography sx={{color: t.color}}>{t.color}</Typography>,
				edit: t => <Input fullWidth type="color" value={t.color} onChange={(i) => t.color = i.target.value}/>
			}
		], [
			"id", {
				sort: true,
				hide: true
			}
		]]
)

const getSubjectCols: () => cols<Subject> = () => new Map<keyof Subject, ColumnDef<Subject>>(
		[[
			"name", {
				sort: true,
				edit: s => <TextField fullWidth value={s.name} onChange={(i) => s.name = i.target.value}/>
			}
		], [
			"color", {
				sort: false,
				format: s => <Typography sx={{color: s.color}}>{s.color}</Typography>,
				edit: s => <Input fullWidth type="color" value={s.color} onChange={(i) => s.color = i.target.value}/>
			}
		], [
			"id", {
				sort: true,
				hide: true
			}
		]]
)

const getPeriodCols: () => cols<Period> = () => new Map<keyof Period, ColumnDef<Period>>(
		[[
			"name", {
				sort: true,
				edit: p => <TextField fullWidth value={p.name} onChange={(i) => p.name = i.target.value}/>
			}
		], [
			"from", {
				sort: true,
				edit: p => <Input fullWidth type="date" value={p.from} onChange={(i) => p.from = i.target.value}/>
			}
		], [
			"to", {
				sort: true,
				edit: p => <Input fullWidth type="date" value={p.to} onChange={(i) => p.to = i.target.value}/>
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