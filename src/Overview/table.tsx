import {Grade, Period, Subject, Type, Weight} from "../entity"
import {Cols, ColumnDefs} from "../components/Table/defs"
import {Badge, IconButton, MenuItem, Select, Stack, TextField, Typography} from "@mui/material"
import {map} from "../ts/utils"
import {NoteRange} from "../entity/config"
import {DatePicker, PickersDay} from "@mui/x-date-pickers"
import dayjs, {Dayjs} from "dayjs"
import ClearIcon from '@mui/icons-material/Clear'


export const getCols: (noteRange: NoteRange, subjects: Subject[], types: Type[], weights: Weight[], periods: Period[]) => Cols<Grade> = (noteRange: NoteRange, subjects: Subject[], types: Type[], weights: Weight[], periods: Period[]) => new Map<keyof Grade, ColumnDefs<Grade>>(
		[[
			"grade", {
				sort: true,
				format: g => <Typography
						color={`rgb(${map(g.grade as number, noteRange.from, noteRange.to, 230, 40)},${map(g.grade as number, noteRange.from, noteRange.to, 40, 230)},0)`}>{g.grade}</Typography>,
				edit: g => <TextField fullWidth value={g.grade ?? ""}
											 onChange={(i) => g.grade = Math.max(Math.min(Number(i.target.value), noteRange?.to), noteRange?.from)}/>,
				extraEdit: (g, update) => <Stack direction="row" spacing={1} alignItems="center">
					<TextField fullWidth value={g.grade ?? ""}
								  onChange={(i) => g.grade = Math.max(Math.min(Number(i.target.value), noteRange?.to), noteRange?.from)}/>
					{g.grade !== null && <IconButton color="default" onClick={() => {
						g.grade = null
						update()
					}}><ClearIcon/>
					</IconButton>}
				</Stack>
			}
		], [
			"subject", {
				sort: true,
				format: g => <Typography
						sx={{color: subjects.find(sub => sub.id === g.subject)?.color ?? 'white'}}>{subjects.find(sub => sub.id === g.subject)?.name ?? (() => {
					console.error('subject:', g.subject)
					return '--notfound--'
				})()}</Typography>,
				extraEdit: (g, update) => <Select fullWidth value={g.subject ?? ""} onChange={(i) => {
					g.subject = Number(i.target.value)
					update()
				}}>
					{subjects.map(sub => <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>)}
				</Select>
			}
		], [
			"type", {
				sort: true,
				format: g => <Typography
						sx={{color: types.find(typ => typ.id === g.type)?.color ?? 'white'}}>{types.find(typ => typ.id === g.type)?.name ?? (() => {
					console.error('type:', g.type)
					return '--notfound--'
				})()}</Typography>,
				extraEdit: (g, update) => <Select fullWidth value={g.type ?? ""} onChange={(i) => {
					g.type = Number(i.target.value)
					update()
				}}>
					{types.map(type => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
				</Select>
			}
		], [
			"date", {
				sort: true,
				edit: g => <DatePicker value={dayjs(g.date, 'DD-MM-YYYY')} onChange={d => {
					g.date = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = g.date
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == g.confirmed ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>,
				extraEdit: (g, update) => <Stack direction="row" spacing={1} alignItems="center">
					<DatePicker value={dayjs(g.date, 'DD-MM-YYYY')} onChange={d => {
						g.date = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
					}} renderInput={(props) => {
						// @ts-ignore
						props.inputProps.value = g.date
						return <TextField {...props} />
					}} renderDay={(day, value, DayComponentProps) => <Badge
							key={day.toString()}
							overlap="circular"
							badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == g.confirmed ? '✨' : null}>
						<PickersDay {...DayComponentProps} />
					</Badge>
					}/>
					{g.date && <IconButton onClick={() => {
						g.date = null
						update()
					}}><ClearIcon/>
					</IconButton>}
				</Stack>,
				preSort: (g) => dayjs(g.date, 'DD-MM-YYYY').unix()
			}
		], [
			"confirmed", {
				sort: true,
				edit: (g, update) => <DatePicker value={dayjs(g.confirmed, 'DD-MM-YYYY')} onChange={(i) => {
					g.confirmed = (i as unknown as Dayjs)?.format('DD-MM-YYYY')
					update()
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = g.confirmed ?? "-"
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == g.date ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>,
				extraEdit: (g, update) => <Stack direction="row" spacing={1} alignItems="center">
					<DatePicker value={dayjs(g.confirmed, 'DD-MM-YYYY')} onChange={(i) => {
						g.confirmed = (i as unknown as Dayjs)?.format('DD-MM-YYYY')
						update()
					}} renderInput={(props) => {
						// @ts-ignore
						props.inputProps.value = g.confirmed ?? "-"
						return <TextField {...props} />
					}} renderDay={(day, value, DayComponentProps) => <Badge
							key={day.toString()}
							overlap="circular"
							badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == g.date ? '✨' : null}>
						<PickersDay {...DayComponentProps} />
					</Badge>
					}/>
					{g.confirmed && <IconButton onClick={() => {
						g.confirmed = null
						update()
					}}><ClearIcon/>
					</IconButton>}
				</Stack>,
				preSort: (g) => dayjs(g.date, 'DD-MM-YYYY').unix()
			}
		], [
			"period", {
				extraEdit: (g, update) => <Select value={g.period} onChange={(i) => {
					g.period = Number(i.target.value)
					update()
				}}>
					{periods.map((period) => <MenuItem key={period.id} value={period.id}>
						<Stack>
							{period.name}
							<br/>
							<Typography variant="overline">{period.from} - {period.to}</Typography>
						</Stack>
					</MenuItem>)}
				</Select>,
				hide: true,
			}
		], [
			"weight", {
				extraEdit: (g, update) => <Select value={g.weight} onChange={(i) => {
					g.weight = i.target.value
					update()
				}}>
					{weights.map((weight) => <MenuItem key={weight.name} value={weight.name}>{weight.name}</MenuItem>)}
				</Select>,
				hide: true
			}
		], [
			"info", {
				sort: false,
				format: g => <>{g.info.split('\n').map(s => <Typography key={s}>{s}</Typography>)}</>,
				extraEdit: (g) => <TextField multiline minRows={2} fullWidth value={g.info} onChange={(i) => g.info = i.target.value}/>
			}
		], [
			"id", {
				hide: true
			}
		]]
)

