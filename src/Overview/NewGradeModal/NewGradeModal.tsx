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
import {errorToast, toastMessage} from "../../ts/toast";
import {Grade} from "../../entity";
import {useGradeModalDefaults, useNoteRange, usePeriods, useSubjects, useTypes} from "../../commands/get";
import {useCreateGrade} from "../../commands/create";
import {GradeModalDefaults, NoteRange} from "../../entity/config";
import {nullableUseState} from '../../ts/utils';
import dayjs, {Dayjs} from "dayjs";
import {useQueryClient} from "@tanstack/react-query";
import ClearIcon from "@mui/icons-material/Clear";
import {DatePicker, PickersDay} from "@mui/x-date-pickers";
import {useAtom} from 'jotai'
import {modalConfirmed, modalOpen} from "../atoms";
import {useSnackbar} from "notistack";

export default function NewGradeModal() {
	const [grade, setGrade] = nullableUseState<Grade>()

	const [open, setOpen] = useAtom(modalOpen);
	const [confirmed] = useAtom(modalConfirmed);

	const toast = useSnackbar()
	const queryClient = useQueryClient()

	const periods = usePeriods({
		onError: (error) => {
			errorToast("Error loading Periods", toast, error)
		}
	});

	const types = useTypes({
		onError: (error) => {
			errorToast("Error loading Types", toast, error)
		}
	});

	const subjects = useSubjects({
		onError: (error) => {
			errorToast("Error loading Subjects", toast, error)
		}
	});

	const noteRange = useNoteRange({
		onError: (error) => {
			errorToast("Error loading noteRange", toast, error)
		}
	});

	const gradeModalDefaults = useGradeModalDefaults({
		onSuccess: (data) => {
			if (grade === null)
				setDefault(data)
		},
		onError: (error) => {
			errorToast("Error loading gradeModalDefaults", toast, error)
		}
	});

	const createGrade = useCreateGrade(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Created Grade", toast)
		},
		onError: (error) => {
			errorToast("Error creating Grade", toast, error)
		}
	})

	useEffect(() => {
		if (open && gradeModalDefaults.isSuccess) {
			setDefault(gradeModalDefaults.data)
		}
	}, [open])

	const handleGradeSliderChange = (value: number | number[], grade: Grade, noteRange: NoteRange) => {
		setGrade({...grade, grade: Math.max(Math.min(Number(value), noteRange.to), noteRange.from)});
	};

	const handleGradeDateChange = (date: string, grade: Grade) => {
		setGrade({...grade, date: date});
	}

	const handleGradeConfirmedDateChange = (date: string | null, grade: Grade) => {
		console.warn("handleGradeConfirmedDateChange", date)
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
		setGrade({...grade, weight: (event.target.value as 'Default' | 'Double' | 'Half')})
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
				weight: 'Default'
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
				weight: 'Default'
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

	return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
		<DialogTitle variant="h5">New Grade</DialogTitle>
		<DialogContent>
			{grade !== null && (
					<Paper elevation={4} variant="elevation" sx={{padding: 2, marginTop: 2}} square>
						<Grid container spacing={4} padding={2}>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Subject</Typography>
									{subjects.isSuccess && <Select value={grade.subject.toString()} margin="none" fullWidth
																			 onChange={(event) => handleSubjectSelectChange(event, grade)}
																			 title="Subject Select">
										{subjects.data.map((subject) => {
											return <MenuItem value={subject.id} key={subject.id} sx={{color: subject.color}}>{subject.name}</MenuItem>
										})}
									</Select>}
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Type</Typography>
									{types.isSuccess && <Select value={grade.type.toString()} margin="none" fullWidth
																		 onChange={(event) => handleTypeSelectChange(event, grade)}
																		 title="Type Select">
										{types.data.map((type) => {
											return <MenuItem value={type.id} key={type.id} sx={{color: type.color}}>{type.name}</MenuItem>
										})}
									</Select>}
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Period</Typography>
									{periods.isSuccess && <Select value={grade.period.toString()} margin="none" fullWidth
																			onChange={(event) => handlePeriodSelectChange(event, grade)}
																			title="Period Select">
										{periods.data.map((period) => {
											return <MenuItem value={period.id} key={period.id}>
												<Stack>
													{period.name}
													<br/>
													<Typography variant="overline">{period.from} - {period.to}</Typography>
												</Stack>
											</MenuItem>
										})}
									</Select>
									}
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Grade</Typography>
									{noteRange.isSuccess && <>
										<Stack spacing={2} direction="row">
											<TextField value={grade.grade ?? ""} type="number" fullWidth margin="none"
														  onChange={(event) => handleGradeInputChange(event, grade, noteRange.data)}
														  title="Grade Input"/>
											{grade.grade !== null && <IconButton color="default" onClick={() => {
												setGrade({...grade, grade: null})
											}}><ClearIcon/>
											</IconButton>
											}
										</Stack>
										<Slider value={grade.grade !== null ? grade.grade : -1} color="secondary" min={noteRange.data.from}
												  max={noteRange.data.to}
												  onChange={(event, value) => handleGradeSliderChange(value, grade, noteRange.data)}
												  title="Grade Slider"/>
									</>}
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
										return <TextField {...params} title="Date Picker"/>
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
									<Stack direction="row" spacing={0.5}>
										<DatePicker value={grade.confirmed ? dayjs(grade.confirmed, 'DD-MM-YYYY') : null}
														onChange={d => {
															handleGradeConfirmedDateChange((d as unknown as Dayjs)?.format('DD-MM-YYYY'), grade)
														}} renderInput={(params) => {
											// @ts-ignore
											params.inputProps.value = grade.confirmed ? grade.confirmed : "";
											return <TextField {...params} title="Confirmed Date Picker"/>
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
										{grade.confirmed && <IconButton color="default" onClick={() => {
											setGrade({...grade, confirmed: null})
										}}><ClearIcon/>
										</IconButton>}
									</Stack>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={8} lg={9}>
								<Stack spacing={2} height={1}>
									<Typography variant="h6" fontWeight="normal">Info</Typography>
									<TextField multiline minRows={2} value={grade.info} type="text" fullWidth margin="none"
												  onChange={(event) => handleInfoInputChange(event, grade)}
												  title="Info Input"
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={4} lg={3}>
								<Stack spacing={1.5} height={1}>
									<Typography variant="h6" fontWeight="normal">Grade Weight</Typography>
									<FormGroup>
										<RadioGroup defaultValue="normal" value={grade.weight}
														onChange={(event) => handleWeightChange(event, grade)}
														title="Grade Weight Select">
											<FormControlLabel value="Default" control={
												<Radio color="secondary"/>
											} label="Default"/>
											<FormControlLabel value="Double" control={
												<Radio color="secondary"/>
											} label="Double"/>
											<FormControlLabel value="Half" control={
												<Radio color="secondary"/>
											} label="Half"/>
										</RadioGroup>
									</FormGroup>
								</Stack>
							</Grid>
						</Grid>
					</Paper>)
			}
		</DialogContent>
		<DialogActions sx={{gap: 0.7}}>
			{gradeModalDefaults.isSuccess &&
					<Button onClick={() => handleClear(gradeModalDefaults.data)} type="submit" variant="outlined"
							  color="secondary">Clear</Button>
			}
			<Button onClick={() => setOpen(false)} type="submit" variant="outlined"
					  color="secondary">Close</Button>
			{grade !== null &&
					<Button onClick={() => {
						createGrade.mutate(grade);
						setOpen(false)
					}} type="submit" variant="outlined" color="success">Create</Button>
			}
		</DialogActions>
	</Dialog>;
}