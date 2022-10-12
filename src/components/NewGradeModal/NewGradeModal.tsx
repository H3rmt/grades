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
import {errorToast, toastMessage, useToast} from "../../utils";
import {Subject} from "../../entity/subject";
import {Type} from "../../entity/type";
import {loadPeriods, loadSubjects, loadTypes} from "./load";
import {createGrade} from "./create";
import {Period} from "../../entity/period";

const gradeDefault = 12
const subjectDefault = ""
const typeDefault = ""
const periodDefault = ""
const infoDefault = ""
const notFinalDefault = false
const doubleDefault = false

function NewGradeModal(props: { open: boolean, closeModal: () => void }) {
	const [grade, setGrade] = useState(gradeDefault)
	const [subject, setSubject] = useState(subjectDefault)
	const [type, setType] = useState(typeDefault)
	const [period, setPeriod] = useState(periodDefault)
	const [info, setInfo] = useState(infoDefault)
	const [notFinal, setNotFinal] = useState(notFinalDefault)
	const [double, setDouble] = useState(doubleDefault)

	const toast = useToast()

	const [subjects, setSubjects] = useState<Array<Subject>>([])
	const [types, setTypes] = useState<Array<Type>>([])
	const [periods, setPeriods] = useState<Array<Period>>([])

	const handleGradeSliderChange = (event: Event, newValue: number | number[]) => {
		setGrade(newValue as number);
	};

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setGrade(Math.max(Math.min(Number(event.target.value), 15), 0));
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

	const handleClear = () => {
		let old = {
			grade,
			subject,
			type,
			period,
			info,
			notFinal,
			double
		}

		setGrade(gradeDefault)
		setSubject(subjectDefault)
		setType(typeDefault)
		setPeriod(periodDefault)
		setInfo(infoDefault)
		setNotFinal(notFinalDefault)
		setDouble(doubleDefault)

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

		let closeClear = toastMessage("success", "Cleared create Note window", toast, undo)
	}

	const handleCreateGrade = () => {
		createGrade(grade, subject, type, info, period, notFinal, double).then(() => {
			props.closeModal()
			toastMessage("success", "Created Grade", toast)
		}).catch((error) => {
			errorToast("Error creating Grade", toast, error)
		})
	}

	const getSubjects = () => {
		loadSubjects().then((data) => {
			setSubjects(data)
		}).catch((error) => {
			setSubjects([])
			errorToast("Error loading Subjects", toast, error)
		})
	}

	const getPeriods = () => {
		loadPeriods().then((data) => {
			setPeriods(data)
		}).catch(() => {
			setPeriods([])
			toastMessage("error", "Error loading Periods", toast)
		})
	}

	const getTypes = () => {
		loadTypes().then((data) => {
			setTypes(data)
		}).catch((error) => {
			setTypes([])
			errorToast("Error loading Types", toast, error)
		})
	}

	useEffect(() => {
		if (props.open) {
			getSubjects()
			getTypes()
			getPeriods()
		}
	}, [props.open])


	return (<Dialog open={props.open} onClose={props.closeModal} fullWidth maxWidth="md">
		<DialogTitle variant="h5">New Grade</DialogTitle>
		<DialogContent>
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
							<Slider value={grade} color="secondary" min={0} max={15} onChange={handleGradeSliderChange}/>
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
								} label="Count x2"/>
							</FormGroup>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
		</DialogContent>
		<DialogActions sx={{gap: 0.7}}>
			<Button onClick={handleClear} type="submit" variant="outlined" color="secondary">Clear</Button>
			<Button onClick={props.closeModal} type="submit" variant="outlined" color="secondary">Close</Button>
			<Button onClick={handleCreateGrade} type="submit" variant="outlined" color="success">Create</Button>
		</DialogActions>
	</Dialog>);
}

export default NewGradeModal