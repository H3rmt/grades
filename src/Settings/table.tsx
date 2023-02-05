import {Cols, ColumnDefs} from "../components/table/defs"
import {Period, Subject, Type} from "../entity"
import {Badge, IconButton, Input, Paper, Stack, TextField, Typography} from "@mui/material"
import dayjs, {Dayjs} from "dayjs"
import {DatePicker, PickersDay} from "@mui/x-date-pickers"
import {randColor} from "../ts/utils"
import {Autorenew} from "@mui/icons-material"

export const getTypeCols: () => Cols<Type> = () => new Map<keyof Type, ColumnDefs<Type>>(
		[[
			"name", {
				sort: true,
				extraEdit: (t) => <TextField fullWidth value={t.name} onChange={(i) => t.name = i.target.value}/>
			}
		], [
			"color", {
				sort: false,
				format: t => <Typography sx={{color: t.color}}>{t.color}</Typography>,
				edit: t => <Input fullWidth type="color" value={t.color} onChange={(i) => t.color = i.target.value}/>,
				extraEdit: (t, update) => <Paper variant="outlined" sx={{padding: 1, backgroundColor: "transparent"}}>
					<Stack direction="row" spacing={1} alignItems="center">
						<Input fullWidth type="color" value={t.color} onChange={(i) => t.color = i.target.value}/>
						<IconButton onClick={() => {
							t.color = randColor()
							update()
						}}>
							<Autorenew/>
						</IconButton>
					</Stack>
				</Paper>
			}
		], [
			"id", {
				hide: true,
				extraShow: true
			}
		]]
)

export const getSubjectCols: () => Cols<Subject> = () => new Map<keyof Subject, ColumnDefs<Subject>>(
		[[
			"name", {
				sort: true,
				extraEdit: s => <TextField fullWidth value={s.name} onChange={(i) => s.name = i.target.value}/>
			}
		], [
			"color", {
				sort: false,
				format: s => <Typography sx={{color: s.color}}>{s.color}</Typography>,
				edit: s => <Input fullWidth type="color" value={s.color} onChange={(i) => s.color = i.target.value}/>,
				extraEdit: (s, update) => <Paper variant="outlined" sx={{padding: 1, backgroundColor: "transparent"}}>
					<Stack direction="row" spacing={1} alignItems="center">
						<Input fullWidth type="color" value={s.color} onChange={(i) => s.color = i.target.value}/>
						<IconButton onClick={() => {
							s.color = randColor()
							update()
						}}>
							<Autorenew/>
						</IconButton>
					</Stack>
				</Paper>
			}
		], [
			"id", {
				hide: true,
				extraShow: true
			}
		]]
)

export const getPeriodCols: () => Cols<Period> = () => new Map<keyof Period, ColumnDefs<Period>>(
		[[
			"name", {
				sort: true,
				extraEdit: p => <TextField fullWidth value={p.name} onChange={(i) => p.name = i.target.value}/>
			}
		], [
			"from", {
				sort: true,
				edit: p => <DatePicker value={dayjs(p.from, 'DD-MM-YYYY')} onChange={d => {
					p.from = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = p.from
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == p.to ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>,
				preSort: (p) => dayjs(p.from, 'DD-MM-YYYY').unix()
			}
		], [
			"to", {
				sort: true,
				edit: p => <DatePicker value={dayjs(p.to, 'DD-MM-YYYY')} onChange={d => {
					p.to = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = p.to
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == p.from ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>,
				preSort: (p) => dayjs(p.to, 'DD-MM-YYYY').unix()
			}
		], [
			"id", {
				hide: true,
				extraShow: true
			}
		]]
)