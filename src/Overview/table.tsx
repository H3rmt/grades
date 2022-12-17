import {Grade, Subject, Type} from "../entity";
import {cols, ColumnDef} from "../components/table/defs";
import {Badge, IconButton, Stack, TextField, Typography} from "@mui/material";
import {map} from "../ts/utils";
import {NoteRange} from "../entity/config";
import {DatePicker, PickersDay} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import ClearIcon from '@mui/icons-material/Clear';


const getCols: (noteRange: NoteRange, subjects: Subject[], types: Type[]) => cols<Grade> = (noteRange: NoteRange, subjects: Subject[], types: Type[]) => new Map<keyof Grade, ColumnDef<Grade>>(
		[[
			"grade", {
				sort: true,
				format: grade => <Typography
						color={`rgb(${map(grade as number, noteRange.from, noteRange.to, 230, 40)},${map(grade as number, noteRange.from, noteRange.to, 40, 230)},0)`}>{grade}</Typography>,
				edit: (r) => <TextField fullWidth value={r.grade}
												onChange={(i) => r.grade = Math.max(Math.min(Number(i.target.value), noteRange?.to), noteRange?.from)}/>
			}
		], [
			"subject", {
				sort: true,
				format: subject => <Typography
						sx={{color: subjects.find(sub => sub.id === subject)?.color || 'white'}}>{subjects.find(sub => sub.id === subject)?.name || (() => {
					console.error('subject:', subject);
					return '--notfound--'
				})()}</Typography>,
			}
		], [
			"type", {
				sort: true,
				format: type => <Typography
						sx={{color: types.find(typ => typ.id === type)?.color || 'white'}}>{types.find(typ => typ.id === type)?.name || (() => {
					console.error('type:', type);
					return '--notfound--'
				})()}</Typography>,
			}
		], [
			"date", {
				sort: true,
				format: date => <Typography>{date}</Typography>,
				edit: (r) => <DatePicker value={dayjs(r.date, 'DD-MM-YYYY')} onChange={(i) => {
					r.date = (i as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = r.date;
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == r.confirmed ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>
			}
		], [
			"confirmed", {
				sort: true,
				format: confirmed => <Typography>{confirmed ?? "-"}</Typography>,
				edit: (r, update) => <Stack direction="row" spacing={0.5}>
					<DatePicker value={dayjs(r.confirmed, 'DD-MM-YYYY')} onChange={(i) => {
						r.confirmed = (i as unknown as Dayjs)?.format('DD-MM-YYYY') || null
						update()
					}} renderInput={(props) => {
						// @ts-ignore
						props.inputProps.value = r.confirmed ?? "-";
						return <TextField {...props} />
					}} renderDay={(day, value, DayComponentProps) => <Badge
							key={day.toString()}
							overlap="circular"
							badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == r.date ? '✨' : null}>
						<PickersDay {...DayComponentProps} />
					</Badge>
					}/>
					{r.confirmed && <IconButton color="default" onClick={() => {
						r.confirmed = null
						update()
					}}><ClearIcon/>
					</IconButton>
					}
				</Stack>
			}
		], [
			"info", {
				sort: true,
				edit: (r) => <TextField fullWidth value={r.info} onChange={(i) => r.info = i.target.value}/>
			}
		], [
			"weight", {
				sort: true,
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