import React, {ChangeEvent, useEffect, useState} from 'react';
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	Grid,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Slider,
	Stack,
	TextField,
	Typography
} from "@mui/material";
import {errorToast, toastMessage, useToast} from "../../ts/toast";
import {Period, Subject, Type} from "../../entity";
import {loadPeriods, loadSubjects, loadTypes} from "../../ts/load";
import {createGrade} from "./create";
import {GradeModalDefaults, NoteRange} from "../../entity/config";
import {loadDefaults, loadNoteRange} from "./loadDefaults";
import {nullableUseState} from '../../ts/utils';

function NewGradeModal(props: { open: boolean, closeModal: () => void, onUpdate: () => void }) {
	const [grade, setGrade] = nullableUseState<number>()
	const [subject, setSubject] = nullableUseState<string>()
	const [type, setType] = nullableUseState<string>()
	const [period, setPeriod] = nullableUseState<string>()
	const [info, setInfo] = nullableUseState<string>()
	const [notFinal, setNotFinal] = nullableUseState<boolean>()
	const [double, setDouble] = nullableUseState<boolean>()

	const [noteRange, setNoteRange] = nullableUseState<NoteRange>()
	const [defaults, setDefaults] = nullableUseState<GradeModalDefaults>()

	const toast = useToast()

	const [subjects, setSubjects] = useState<Subject[]>([])
	const [types, setTypes] = useState<Type[]>([])
	const [periods, setPeriods] = useState<Period[]>([])

	const handleGradeSliderChange = (event: Event, newValue: number | number[]) => {
		setGrade(newValue as number);
	};

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		// @ts-ignore
		setGrade(Math.max(Math.min(Number(event.target.value), noteRange?.to), noteRange?.from));
	};

	const handleSubjectSelectChange = (event: SelectChangeEvent) => {
		setSubject(event.target.value)
	}

	const handleTypeSelectChange = (event: SelectChangeEvent) => {
		setType(event.target.value)
	}

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value)
	}

	const handleInfoInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInfo(event.target.value)
	}

	const handleNotFinalCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNotFinal(event.target.checked)
	}

	const handleDoubleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		setDouble(event.target.checked)
	}

	const handleCreateGrade = async () => {
		// @ts-ignore
		await createGrade(grade, subject, type, info, period, notFinal, double).then(() => {
			props.closeModal()
			toastMessage("success", "Created Grade", toast)
			props.onUpdate()
		}).catch((error) => {
			errorToast("Error creating Grade", toast, error)
		})
	}

	const getSubjects = async () => {
		await loadSubjects().then((data) => {
			setSubjects(data)
		}).catch((error) => {
			errorToast("Error loading Subjects", toast, error)
		})
	}

	const getPeriods = async () => {
		await loadPeriods().then((data) => {
			setPeriods(data)
		}).catch((error) => {
			errorToast("Error loading Periods", toast, error)
		})
	}

	const getTypes = async () => {
		await loadTypes().then((data) => {
			setTypes(data)
		}).catch((error) => {
			errorToast("Error loading Types", toast, error)
		})
	}

	const getNoteRange = async () => {
		await loadNoteRange().then((data) => {
			setNoteRange(data)
		}).catch((error) => {
			errorToast("Error loading Note Range", toast, error)
		})
	}

	const getDefaults = async () => {
		await loadDefaults().then((data) => {
			setDefaults(data)
			setDefault(data)
		}).catch((error) => {
			errorToast("Error loading Modal defaults", toast, error)
		})
	}

	const setDefault = (defaults: GradeModalDefaults) => {
		setGrade(defaults?.grade_default)
		setSubject(defaults?.subject_default)
		setType(defaults?.type_default)
		setPeriod(defaults?.period_default)
		setInfo(defaults?.info_default)
		setDouble(defaults?.double_default)
		setNotFinal(defaults?.not_final_default)
	}

	const handleClear = async () => {
		let old = {grade, subject, type, period, info, notFinal, double}
		// @ts-ignore
		setDefault(defaults)

		const undo = () => {
			setGrade(old.grade)
			setSubject(old.subject)
			setType(old.type)
			setPeriod(old.period)
			setInfo(old.info)
			setNotFinal(old.notFinal)
			setDouble(old.double)
			toastMessage("success", "Undid clear Note window", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Cleared create Note window", toast, undo)
	}

	useEffect(() => {
		getSubjects()
		getTypes()
		getPeriods()
		getNoteRange()
		getDefaults()
	}, [])

	let render = grade !== undefined && subject !== undefined && type !== undefined && period !== undefined && info !== undefined && notFinal !== undefined && double !== undefined && noteRange !== undefined

	return (<Dialog open={props.open} onClose={props.closeModal} fullWidth maxWidth="md">
		<DialogTitle variant="h5">New Grade</DialogTitle>
		<DialogContent>
			{render && (
					<Paper elevation={4} variant="elevation" sx={{padding: 2, marginTop: 2}} square>
						<Grid container spacing={4} padding={2}>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Subject</Typography>
									<Select value={subject} margin="none" fullWidth onChange={handleSubjectSelectChange}>
										{subjects.map((subject) => {
											return <MenuItem sx={{color: subject.color}} value={subject.id}>{subject.name}</MenuItem>
										})}
									</Select>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Type</Typography>
									<Select value={type} margin="none" fullWidth onChange={handleTypeSelectChange}>
										{types.map((type) => {
											return <MenuItem sx={{color: type.color}} value={type.id}>{type.name}</MenuItem>
										})}
									</Select>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Period</Typography>
									<Select value={period} margin="none" fullWidth onChange={handlePeriodSelectChange}>
										{periods.map((period) => {
											return <MenuItem value={period.id}>
												<Stack>
													{period.name}
													<br/>
													<Typography variant="overline">{period.from} - {period.to}</Typography>
												</Stack>
											</MenuItem>
										})}
									</Select>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={12}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Grade</Typography>
									<TextField value={grade} type="number" fullWidth margin="none" onChange={handleGradeInputChange}/>
									<Slider value={grade} color="secondary" min={noteRange?.from} max={noteRange?.to}
											  onChange={handleGradeSliderChange}/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={8} lg={9}>
								<Stack spacing={2} height={1}>
									<Typography variant="h6" fontWeight="normal">Info</Typography>
									<TextField multiline minRows={2} value={info} type="text" fullWidth margin="none"
												  onChange={handleInfoInputChange}/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={4} lg={3}>
								<Stack spacing={1.5} height={1}> {/*spacing={1.5} to compensate margin of 1. Checkbox*/}
									<Typography variant="h6" fontWeight="normal">Extra</Typography>
									<FormGroup>
										<FormControlLabel control={
											<Checkbox color="secondary" checked={notFinal} onChange={handleNotFinalCheckboxChange}/>
										} label="Not Final"/>
										<FormControlLabel control={
											<Checkbox color="secondary" checked={double} onChange={handleDoubleCheckboxChange}/>
										} label="Double"/>
									</FormGroup>
								</Stack>
							</Grid>
						</Grid>
					</Paper>)
			}
		</DialogContent>
		<DialogActions sx={{gap: 0.7}}>
			<Button onClick={handleClear} type="submit" variant="outlined" color="secondary">Clear</Button>
			<Button onClick={props.closeModal} type="submit" variant="outlined" color="secondary">Close</Button>
			<Button onClick={handleCreateGrade} type="submit" variant="outlined" color="success">Create</Button>
		</DialogActions>
	</Dialog>);
}

export default NewGradeModal