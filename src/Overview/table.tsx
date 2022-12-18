import {Grade, Subject, Type} from "../entity";
import {cols, ColumnDef} from "../components/table/defs";
import {Badge, IconButton, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {map} from "../ts/utils";
import {NoteRange} from "../entity/config";
import {DatePicker, PickersDay} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import ClearIcon from '@mui/icons-material/Clear';
import React from "react";


const getCols: (noteRange: NoteRange, subjects: Subject[], types: Type[]) => cols<Grade> = (noteRange: NoteRange, subjects: Subject[], types: Type[]) => new Map<keyof Grade, ColumnDef<Grade>>(
		[[
			"grade", {
				sort: true,
				format: g => <Typography
						color={`rgb(${map(g.grade as number, noteRange.from, noteRange.to, 230, 40)},${map(g.grade as number, noteRange.from, noteRange.to, 40, 230)},0)`}>{g.grade}</Typography>,
				edit: (g, update) => <Stack direction="row" spacing={0.5}>
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
					console.error('subject:', g.subject);
					return '--notfound--'
				})()}</Typography>,
			}
		], [
			"type", {
				sort: true,
				format: g => <Typography
						sx={{color: types.find(typ => typ.id === g.type)?.color ?? 'white'}}>{types.find(typ => typ.id === g.type)?.name ?? (() => {
					console.error('type:', g.type);
					return '--notfound--'
				})()}</Typography>,
			}
		], [
			"date", {
				sort: true,
				edit: g => <DatePicker value={dayjs(g.date, 'DD-MM-YYYY')} onChange={d => {
					g.date = (d as unknown as Dayjs)?.format('DD-MM-YYYY')
				}} renderInput={(props) => {
					// @ts-ignore
					props.inputProps.value = g.date;
					return <TextField {...props} />
				}} renderDay={(day, value, DayComponentProps) => <Badge
						key={day.toString()}
						overlap="circular"
						badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == g.confirmed ? '✨' : null}>
					<PickersDay {...DayComponentProps} />
				</Badge>
				}/>,
				preSort: (g) => dayjs(g.date, 'DD-MM-YYYY').unix()
			}
		], [
			"confirmed", {
				sort: true,
				edit: (g, update) => <Stack direction="row" spacing={0.5}>
					<DatePicker value={dayjs(g.confirmed, 'DD-MM-YYYY')} onChange={(i) => {
						g.confirmed = (i as unknown as Dayjs)?.format('DD-MM-YYYY')
						update()
					}} renderInput={(props) => {
						// @ts-ignore
						props.inputProps.value = g.confirmed ?? "-";
						return <TextField {...props} />
					}} renderDay={(day, value, DayComponentProps) => <Badge
							key={day.toString()}
							overlap="circular"
							badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == g.date ? '✨' : null}>
						<PickersDay {...DayComponentProps} />
					</Badge>
					}/>
					{g.confirmed && <IconButton color="default" onClick={() => {
						g.confirmed = null
						update()
					}}><ClearIcon/>
					</IconButton>}
				</Stack>,
				preSort: (g) => dayjs(g.date, 'DD-MM-YYYY').unix()
			}
		], [
			"info", {
				// TODO enable or disable this sort
				sort: true,
				edit: (g) => <TextField fullWidth value={g.info} onChange={(i) => g.info = i.target.value}/>,
				preSort: (g) => g.info.length > 0
			}
		], [
			"weight", {
				sort: true,
				format: g => <Typography>{g.weight == "Half" ? "/2" : g.weight == "Double" ? "x2" : ""}</Typography>,
				preSort: (g) => g.weight == "Half" ? 0.5 : g.weight == "Double" ? 2 : 1,
				edit: (g, update) => <Select value={g.weight} onChange={(i) => {
					g.weight = i.target.value as "Default" | "Double" | "Half";
					update()
				}}>
					<MenuItem value="Default"> &nbsp; </MenuItem>
					<MenuItem value="Double">x2</MenuItem>
					<MenuItem value="Half">/2</MenuItem>
				</Select>
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