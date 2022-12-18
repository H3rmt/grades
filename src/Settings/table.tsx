import {cols, ColumnDef} from "../components/table/defs";
import {Period, Subject, Type} from "../entity";
import {Badge, Input, TextField, Typography} from "@mui/material";
import {DatePicker, PickersDay} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";

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
				edit: p => <DatePicker value={dayjs(p.from, 'DD-MM-YYYY')} onChange={d => {
					p.from = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = p.from;
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == p.to ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>
			}
		], [
			"to", {
				sort: true,
				edit: p => <DatePicker value={dayjs(p.to, 'DD-MM-YYYY')} onChange={d => {
					p.to = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = p.to;
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == p.from ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>
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