import {ChangeEvent, useEffect} from 'react'
import {
	Badge,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	SelectChangeEvent,
	Slider,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import {toastMessage} from '../../components/Toast/toast'
import {Grade} from '../../entity'
import {useGradeModalDefaults, useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from '../../commands/get'
import {GradeModalDefaults, NoteRange} from '../../entity/config'
import {capitalizeFirstLetter, useUndefinedState} from '../../ts/utils'
import dayjs, {Dayjs} from 'dayjs'
import ClearIcon from '@mui/icons-material/Clear'
import {DatePicker, PickersDay} from '@mui/x-date-pickers'
import {useSnackbar} from 'notistack'
import ReactQueryData from '../../components/ReactQueryData/ReactQueryData'
import {useCreateGrade} from '../../commands/create'
import {useNavigate, useSearch} from '@tanstack/react-router'
import {newGradeRoute} from './route'
import {PickersDayProps} from '@mui/x-date-pickers/PickersDay/PickersDay'
import {LinkRef} from '../../components/LinkRef/LinkRef'

export type NewGradeModalSearch = {
	confirmed: boolean
}

type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

export default function NewGradeModal(props: Partial<NewGradeModalSearch> /*only used for testing*/) {
	const [grade, setGrade] = useUndefinedState<Nullable<Grade>>()

	let confirmed: boolean
	if (props.confirmed === undefined) {
		// @ts-ignore
		const params = useSearch<'/overview/newGrade', true, NewGradeModalSearch, NewGradeModalSearch>({from: newGradeRoute.id})
		confirmed = params.confirmed
	} else {
		confirmed = props.confirmed ?? false
	}

	const [previousConfirmed, setPreviousConfirmed] = useUndefinedState()

	const toast = useSnackbar()

	const [periods, periodsS] = usePeriods()

	const [subjects, subjectsS] = useSubjects()

	const [types, typesS] = useTypes()

	const [weights, weightsS] = useWeights()

	const [noteRange, noteRangeS] = useNoteRange()

	const [gradeModalDefaults, gradeModalDefaultsS] = useGradeModalDefaults()

	const navigate = useNavigate({from: '/overview/newGrade'})

	// set Default values if default values are loaded and grade has not been set to default values yet
	useEffect(() => {
		if (grade === undefined && gradeModalDefaultsS.isSuccess && gradeModalDefaults !== undefined)
			setDefault(gradeModalDefaults)
	}, [gradeModalDefaults])


	// set Default values if modal opened in other mode
	useEffect(() => {
		if (confirmed !== previousConfirmed && gradeModalDefaultsS.isSuccess && gradeModalDefaults !== undefined) {
			setPreviousConfirmed(confirmed)
			setDefault(gradeModalDefaults)
		}
	}, [open])

	const [create] = useCreateGrade()

	const handleGradeSliderChange = (value: number | number[], grade: Nullable<Grade>, noteRange: NoteRange) => {
		setGrade({...grade, grade: Math.max(Math.min(Number(value), noteRange.to), noteRange.from)})
	}

	const handleGradeDateChange = (date: string, grade: Nullable<Grade>) => {
		setGrade({...grade, date: date})
	}

	const handleGradeConfirmedDateChange = (date: string | null, grade: Nullable<Grade>) => {
		setGrade({...grade, confirmed: date})
	}

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, grade: Nullable<Grade>, noteRange: NoteRange) => {
		setGrade({...grade, grade: Math.max(Math.min(Number(event.target.value), noteRange.to), noteRange.from)})
	}

	const handleSubjectSelectChange = (event: SelectChangeEvent, grade: Nullable<Grade>) => {
		setGrade({...grade, subject: Number(event.target.value)})
	}

	const handleTypeSelectChange = (event: SelectChangeEvent, grade: Nullable<Grade>) => {
		setGrade({...grade, type: Number(event.target.value)})
	}

	const handlePeriodSelectChange = (event: SelectChangeEvent, grade: Nullable<Grade>) => {
		setGrade({...grade, period: Number(event.target.value)})
	}

	const handleInfoInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, grade: Nullable<Grade>) => {
		setGrade({...grade, info: event.target.value})
	}

	const handleWeightChange = (event: ChangeEvent<HTMLInputElement>, grade: Nullable<Grade>) => {
		setGrade({...grade, weight: event.target.value})
	}

	const tryCreate = async () => {
		const {z} = await import('../../ts/zod')
		// const {z} = await import('zod')

		const createGradeSchema = z.object({
			id: z.literal(-1),
			subject: z.number().positive({
				message: 'Subject is required',
			}),
			type: z.number().positive({
				message: 'Type is required',
			}),
			info: z.string(),
			grade: z.number().nonnegative().nullable(),
			period: z.number().positive({
				message: 'Period is required',
			}),
			confirmed: z.string().nullable(),
			date: z.string(),//.nullable(),
			weight: z.string(),
		}).strict()

		const parse = createGradeSchema.safeParse(grade)
		if (parse.success) {
			create(parse.data)
		} else {
			const mess = parse.error.errors.map(err => `${capitalizeFirstLetter(err.path[0].toString())}: ${err.message}`).join(', ')
			toastMessage('error', `Invalid grade ${mess}`, toast)
		}
	}

	const setDefault = (defaults: GradeModalDefaults) => {
		if (confirmed)
			setGrade({
				id: -1,
				confirmed: dayjs().format('DD-MM-YYYY'),
				date: dayjs().add(-7, 'day').format('DD-MM-YYYY'),
				grade: defaults.grade_default,
				subject: defaults.subject_default ?? null,
				type: defaults.type_default ?? null,
				period: defaults.period_default ?? null,
				info: '',
				weight: 'Normal'
			})
		else
			setGrade({
				id: -1,
				confirmed: null,
				date: dayjs().format('DD-MM-YYYY'),
				grade: null,
				subject: defaults.subject_default ?? null,
				type: defaults.type_default ?? null,
				period: defaults.period_default ?? null,
				info: '',
				weight: 'Normal'
			})
	}

	const handleClear = async (gradeModalDefaults: GradeModalDefaults) => {
		const oldGrade = Object.assign({}, grade)
		setDefault(gradeModalDefaults)

		const undo = () => {
			setGrade(oldGrade)
			toastMessage('success', 'Undid clear Note window', toast)
			closeClear()
		}

		const closeClear = toastMessage('warning', 'Cleared create Note window', toast, undo)
	}

	return <Dialog open={true} fullWidth maxWidth="md" onClose={() => navigate({to: '/overview'})}>
		<DialogTitle variant="h5">New Grade</DialogTitle>
		<DialogContent>
			<Paper elevation={4} variant="elevation" sx={{padding: 2, marginTop: 2}} square>
				<Grid container spacing={4} padding={2}>
					<Grid item xs={12} sm={6} lg={4}>
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight="normal">Subject</Typography>
							<ReactQueryData isError={grade === undefined} query={subjectsS} data={subjects} display={(subjects) =>
								grade !== undefined &&
									<Select color="primary" value={(grade?.subject || '').toString()} margin="none" fullWidth
											  onChange={(event) => handleSubjectSelectChange(event, grade)}
											  title="Subject Select">
										{subjects.map((subject) => {
											return <MenuItem value={subject.id} key={subject.id}
																  sx={{color: subject.color}}>{subject.name}</MenuItem>
										})}
									</Select>
							}/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} lg={4}>
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight="normal">Type</Typography>
							<ReactQueryData isError={grade === undefined} query={typesS} data={types} display={(types) =>
								grade !== undefined &&
									<Select color="primary" value={(grade.type || '').toString()} margin="none" fullWidth
											  onChange={(event) => handleTypeSelectChange(event, grade)}
											  title="Type Select">
										{types.map((type) => {
											return <MenuItem value={type.id} key={type.id} sx={{color: type.color}}>{type.name}</MenuItem>
										})}
									</Select>
							}/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} lg={4}>
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight="normal">Period</Typography>
							<ReactQueryData isError={grade === undefined} query={periodsS} data={periods} display={(periods) =>
								grade !== undefined &&
									<Select color="primary" value={(grade.period || '').toString()} margin="none" fullWidth
											  onChange={(event) => handlePeriodSelectChange(event, grade)}
											  title="Period Select">
										{periods.map((period) => {
											return <MenuItem value={period.id} key={period.id}>
												<Stack>
													{period.name}
													<br/>
													<Typography variant="overline">{period.from} - {period.to}</Typography>
												</Stack>
											</MenuItem>
										})}
									</Select>
							}/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} lg={4}>
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight="normal">Grade</Typography>
							<ReactQueryData isError={grade === undefined} query={noteRangeS} data={noteRange} display={(noteRange) =>
								grade !== undefined &&
									<>
										<Stack spacing={1} direction="row" alignItems="center">
											<TextField color="primary" value={grade.grade ?? ''} type="number" fullWidth margin="none"
														  onChange={(event) => handleGradeInputChange(event, grade, noteRange)}
														  title="Grade Input"/>
											{grade.grade !== null && <IconButton onClick={() => {
												setGrade({...grade, grade: null})
											}}><ClearIcon/>
											</IconButton>}
										</Stack>
										<Slider color="primary" value={grade.grade ?? noteRange.from}
												  min={noteRange.from}
												  max={noteRange.to}
												  onChange={(event, value) => handleGradeSliderChange(value, grade, noteRange)}
												  title="Grade Slider"/>
									</>
							}/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} lg={4}>
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight="normal">Date</Typography>
							{grade !== undefined && periods !== undefined &&
									<Stack direction="row" spacing={1} alignItems="center">
										<DatePicker value={grade.date ? dayjs(grade.date, 'DD-MM-YYYY') : ''}
											onChange={d => {
												handleGradeDateChange((d as unknown as Dayjs)?.format('DD-MM-YYYY'), grade)
											}} // @ts-ignore
											renderInput={(params: { inputProps: { value: string } }) => {
												params.inputProps.value = grade.date ?? ''
												return <TextField {...params} color="primary" title="Date Picker"/>
											}} renderDay={(day: Dayjs, value: unknown, DayComponentProps: PickersDayProps<unknown>) => {
												const period = periods.find(p => p.id == grade?.period)
												if (period !== undefined && period !== null) {
													if (dayjs(period.to, 'DD-MM-YYYY').diff((day as unknown as Dayjs)) < 0)
														DayComponentProps.disabled = true
													if (dayjs(period.from, 'DD-MM-YYYY').diff((day as unknown as Dayjs)) > 0)
														DayComponentProps.disabled = true
												}

												return <Badge
													key={day.toString()}
													overlap="circular"
													badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == grade.confirmed ? '✨' : null}>
													<PickersDay {...DayComponentProps} />
												</Badge>
											}}/>
										{grade.date && <IconButton onClick={() => {
											setGrade({...grade, date: null})
										}}><ClearIcon/>
										</IconButton>}
									</Stack>}
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} lg={4}>
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight="normal">Confirmed Date</Typography>
							{grade !== undefined && <Stack direction="row" spacing={1} alignItems="center">
								<DatePicker value={grade.confirmed ? dayjs(grade.confirmed, 'DD-MM-YYYY') : ''}
									onChange={d => {
										handleGradeConfirmedDateChange((d as unknown as Dayjs)?.format('DD-MM-YYYY'), grade)
									}} // @ts-ignore
									renderInput={(params: { inputProps: { value: string } }) => {
										params.inputProps.value = grade.confirmed ?? ''
										return <TextField {...params} color="primary" title="Confirmed Date Picker"/>
									}} renderDay={(day: Dayjs, value: unknown, DayComponentProps: PickersDayProps<unknown>) => {
										if (dayjs(grade.date, 'DD-MM-YYYY').diff((day as unknown as Dayjs)) > 0)
											DayComponentProps.disabled = true
										return <Badge
											key={day.toString()}
											overlap="circular"
											badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == grade.date ? '✨' : null}>
											<PickersDay {...DayComponentProps} />
										</Badge>
									}}/>
								{grade.confirmed && <IconButton onClick={() => {
									setGrade({...grade, confirmed: null})
								}}><ClearIcon/>
								</IconButton>}
							</Stack>}
						</Stack>
					</Grid>
					<Grid item xs={12} sm={8} lg={9}>
						<Stack spacing={2} height={1}>
							<Typography variant="h6" fontWeight="normal">Info</Typography>
							{grade !== undefined &&
									<TextField color="primary" multiline minRows={2} value={grade.info} type="text" fullWidth margin="none"
												  onChange={(event) => handleInfoInputChange(event, grade)}
												  title="Info Input"
									/>}
						</Stack>
					</Grid>
					<Grid item xs={12} sm={4} lg={3}>
						<Stack spacing={1.5} height={1}>
							<Typography variant="h6" fontWeight="normal">Grade Weight</Typography>
							<ReactQueryData isError={grade === undefined} query={weightsS} data={weights} display={(weights) =>
								grade !== undefined &&
									<FormGroup>
										<RadioGroup defaultValue="Normal" value={grade.weight} title="Grade Weight Select"
											onChange={(event) => handleWeightChange(event, grade)}>
											{weights.map((weight) => <FormControlLabel control={
												<Radio color="primary"/>
											} label={weight.name} value={weight.name} key={weight.name}/>)}
										</RadioGroup>
									</FormGroup>
							}/>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
		</DialogContent>
		<DialogActions sx={{gap: 1.7}} disableSpacing={true}>
			<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={(gradeModalDefaults) =>
				<Button onClick={() => handleClear(gradeModalDefaults)} type="submit" variant="contained" color="warning">Clear</Button>
			}/>
			<Button component={LinkRef} to="/overview" type="submit" variant="contained">Close</Button>
			{grade !== undefined &&
					<Button component={LinkRef} to="/overview" onClick={tryCreate} type="submit" variant="contained"
							  color="success">Create</Button>}
		</DialogActions>
	</Dialog>
}