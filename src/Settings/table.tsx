import {cols, Column} from "../components/table/table";
import {Period, Subject, Type} from "../entity";
import {TextField} from "@mui/material";

const getTypeCols: () => cols<Type> = () => new Map<keyof Type, Column<Type>>(
		[[
			"name", {
				sort: true
			}
		], [
			"color", {
				sort: true
			}
		]]
)

const getSubjectCols: () => cols<Subject> = () => new Map<keyof Subject, Column<Subject>>(
		[[
			"name", {
				sort: true
			}
		], [
			"color", {
				sort: true
			}
		]]
)

const getPeriodCols: () => cols<Period> = () => new Map<keyof Period, Column<Period>>(
		[[
			"name", {
				sort: true,
				edit: (r) => <TextField value={r.name} onChange={(i) => r.name = i.target.value}/>
			}
		], [
			"from", {
				sort: true,
				edit: (r) => <TextField value={r.from} onChange={(i) => r.from = i.target.value}/>
			}
		], [
			"to", {
				sort: true,
				edit: (r) => <TextField value={r.to} onChange={(i) => r.to = i.target.value}/>
			}
		]]
)

export {
	getPeriodCols,
	getSubjectCols,
	getTypeCols
};