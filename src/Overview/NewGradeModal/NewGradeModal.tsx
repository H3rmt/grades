import {ChangeEvent, useEffect} from 'react';
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
} from "@mui/material";
import {toastMessage} from "../../ts/toast";
import {Grade} from "../../entity";
import {useGradeModalDefaults, useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from "../../commands/get";
import {GradeModalDefaults, NoteRange} from "../../entity/config";
import {useUndefinedState} from '../../ts/utils';
import dayjs, {Dayjs} from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import {DatePicker, PickersDay} from "@mui/x-date-pickers";
import {useSnackbar} from "notistack";
import ReactQueryData from "../../components/ReactQueryData/ReactQueryData";
import {useCreateGrade} from "../../commands/create";
import {RLink} from "../../components/Navbar/Navbar";
import {useSearch} from "@tanstack/react-router";
import {rootRoute} from "../../ts/root";

export type NewGradeModalSearch = {
	confirmed: boolean
}

export function NewGradeModal(props: Partial<NewGradeModalSearch> /*only used for testing*/) {
	const [grade, setGrade] = useUndefinedState<Grade>()

	let confirmed: boolean
	if(props.confirmed === undefined) {
		// @ts-ignore
		const params = useSearch<"newGrade", true, NewGradeModalSearch, NewGradeModalSearch>({from: newGradeRoute.id})
		confirmed = params.confirmed
	} else {
		confirmed = props.confirmed
	}

	const [previousConfirmed, setPreviousConfirmed] = useUndefinedState()

	const toast = useSnackbar()

	const [periods, , periodsS] = usePeriods()

	const [subjects, , subjectsS] = useSubjects()

	const [types, , typesS] = useTypes()

	const [weights, , weightsS] = useWeights()

	const [noteRange, , noteRangeS] = useNoteRange()

	const [gradeModalDefaults, , gradeModalDefaultsS] = useGradeModalDefaults()

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

	const handleGradeSliderChange = (value: number | number[], grade: Grade, noteRange: NoteRange) => {
		setGrade({...grade, grade: Math.max(Math.min(Number(value), noteRange.to), noteRange.from)});
	};

	const handleGradeDateChange = (date: string, grade: Grade) => {
		setGrade({...grade, date: date});
	}

	const handleGradeConfirmedDateChange = (date: string | null, grade: Grade) => {
		setGrade({...grade, confirmed: date});
	}

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, grade: Grade, noteRange: NoteRange) => {
		setGrade({...grade, grade: Math.max(Math.min(Number(event.target.value), noteRange.to), noteRange.from)});
	};

	const handleSubjectSelectChange = (event: SelectChangeEvent, grade: Grade) => {
		setGrade({...grade, subject: Number(event.target.value)})
	}

	const handleTypeSelectChange = (event: SelectChangeEvent, grade: Grade) => {
		setGrade({...grade, type: Number(event.target.value)})
	}

	const handlePeriodSelectChange = (event: SelectChangeEvent, grade: Grade) => {
		setGrade({...grade, period: Number(event.target.value)})
	}

	const handleInfoInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, grade: Grade) => {
		setGrade({...grade, info: event.target.value})
	}

	const handleWeightChange = (event: ChangeEvent<HTMLInputElement>, grade: Grade) => {
		setGrade({...grade, weight: event.target.value})
	}

	const setDefault = (defaults: GradeModalDefaults) => {
		if (confirmed)
			setGrade({
				id: -1,
				confirmed: dayjs().format("DD-MM-YYYY"),
				date: dayjs().add(-7, "day").format("DD-MM-YYYY"),
				grade: defaults.grade_default,
				subject: defaults.subject_default ?? 0,
				type: defaults.type_default ?? 0,
				period: defaults.period_default ?? 0,
				info: '',
				weight: 'Normal'
			})
		else
			setGrade({
				id: -1,
				confirmed: null,
				date: dayjs().format("DD-MM-YYYY"),
				grade: null,
				subject: defaults.subject_default ?? 0,
				type: defaults.type_default ?? 0,
				period: defaults.period_default ?? 0,
				info: '',
				weight: 'Normal'
			})
	}

	const handleClear = async (gradeModalDefaults: GradeModalDefaults) => {
		let oldGrade = Object.assign({}, grade)
		setDefault(gradeModalDefaults)

		const undo = () => {
			setGrade(oldGrade)
			toastMessage("success", "Undid clear Note window", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Cleared create Note window", toast, undo)
	}

	return <Dialog open={true} disableEscapeKeyDown fullWidth maxWidth="md">
		<DialogTitle variant="h5">New Grade</DialogTitle>
		<DialogContent>
			{grade !== undefined && (
					<Paper elevation={4} variant="elevation" sx={{padding: 2, marginTop: 2}} square>
						<Grid container spacing={4} padding={2}>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Subject</Typography>
									<ReactQueryData query={subjectsS} data={subjects} display={(subjects) =>
											<Select color="secondary" value={(grade?.subject || '').toString()} margin="none" fullWidth
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
									<ReactQueryData query={typesS} data={types} display={(types) =>
											<Select color="secondary" value={(grade.type || '').toString()} margin="none" fullWidth
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
									<ReactQueryData query={periodsS} data={periods} display={(periods) =>
											<Select color="secondary" value={(grade.period || '').toString()} margin="none" fullWidth
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
									<ReactQueryData query={noteRangeS} data={noteRange} display={(noteRange) =>
											<>
												<Stack spacing={1} direction="row" alignItems="center">
													<TextField color="secondary" value={grade.grade ?? ""} type="number" fullWidth margin="none"
																  onChange={(event) => handleGradeInputChange(event, grade, noteRange)}
																  title="Grade Input"/>
													{grade.grade !== null && <IconButton onClick={() => {
														setGrade({...grade, grade: null})
													}}><ClearIcon/>
													</IconButton>}
												</Stack>
												<Slider color="secondary" value={grade.grade ?? noteRange.from}
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
									<DatePicker value={dayjs(grade.date, 'DD-MM-YYYY')}
													onChange={d => {
														handleGradeDateChange((d as unknown as Dayjs)?.format('DD-MM-YYYY'), grade)
													}} renderInput={(params) => {
										// @ts-ignore
										params.inputProps.value = grade.date;
										return <TextField {...params} color="secondary" title="Date Picker"/>
									}} renderDay={(day, value, DayComponentProps) => <Badge
											key={day.toString()}
											overlap="circular"
											badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == grade.confirmed ? '✨' : null}>
										<PickersDay {...DayComponentProps} />
									</Badge>
									}/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Confirmed Date</Typography>
									<Stack direction="row" spacing={1} alignItems="center">
										<DatePicker value={grade.confirmed ? dayjs(grade.confirmed, 'DD-MM-YYYY') : null}
														onChange={d => {
															handleGradeConfirmedDateChange((d as unknown as Dayjs)?.format('DD-MM-YYYY'), grade)
														}} renderInput={(params) => {
											// @ts-ignore
											params.inputProps.value = grade.confirmed ? grade.confirmed : "";
											return <TextField {...params} color="secondary" title="Confirmed Date Picker"/>
										}} renderDay={(day, value, DayComponentProps) => {
											if (dayjs(grade.date, 'DD-MM-YYYY').diff((day as unknown as Dayjs)) > 0)
												DayComponentProps.disabled = true
											return <Badge
													key={day.toString()}
													overlap="circular"
													badgeContent={!DayComponentProps.outsideCurrentMonth && (day as unknown as Dayjs).format('DD-MM-YYYY') == grade.date ? '✨' : null}>
												<PickersDay {...DayComponentProps} />
											</Badge>
										}
										}/>
										{grade.confirmed && <IconButton onClick={() => {
											setGrade({...grade, confirmed: null})
										}}><ClearIcon/>
										</IconButton>}
									</Stack>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={8} lg={9}>
								<Stack spacing={2} height={1}>
									<Typography variant="h6" fontWeight="normal">Info</Typography>
									<TextField color="secondary" multiline minRows={2} value={grade.info} type="text" fullWidth margin="none"
												  onChange={(event) => handleInfoInputChange(event, grade)}
												  title="Info Input"
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={4} lg={3}>
								<Stack spacing={1.5} height={1}>
									<Typography variant="h6" fontWeight="normal">Grade Weight</Typography>
									<ReactQueryData query={weightsS} data={weights} display={(weights) =>
											<FormGroup>
												<RadioGroup color="secondary" defaultValue="Normal" value={grade.weight} title="Grade Weight Select"
																onChange={(event) => handleWeightChange(event, grade)}>
													{weights.map((weight) => <FormControlLabel control={
														<Radio color="secondary"/>
													} label={weight.name} value={weight.name} key={weight.name}/>)}
												</RadioGroup>
											</FormGroup>
									}/>
								</Stack>
							</Grid>
						</Grid>
					</Paper>)
			}
		</DialogContent>
		<DialogActions sx={{gap: 0.7}}>
			<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={(gradeModalDefaults) =>
					<Button onClick={() => handleClear(gradeModalDefaults)} type="submit" variant="contained" color="warning">Clear</Button>
			}/>
			<Button component={RLink} to="/">Close</Button>
			{grade !== undefined && <Button component={RLink} to="/" onClick={() => {
				create(grade);
			}}>Create</Button>}
		</DialogActions>
	</Dialog>;
}

export const newGradeRoute = rootRoute.createRoute<string, "newGrade", {}, NewGradeModalSearch>({
	path: 'newGrade',
	component: NewGradeModal
})
