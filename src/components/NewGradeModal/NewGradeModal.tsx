import React, {ChangeEvent} from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	Grid,
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
import {errorToast, toastMessage, useToast} from "../../ts/toast";
import {Grade} from "../../entity";
import {useGradeModalDefaults, useNoteRange, usePeriods, useSubjects, useTypes} from "../../ts/load";
import {createGrade} from "./create";
import {GradeModalDefaults, NoteRange} from "../../entity/config";
import {nullableUseState} from '../../ts/utils';
import dayjs from "dayjs";
import {useQueryClient} from "@tanstack/react-query";

function NewGradeModal(props: { open: boolean, closeModal: () => void }) {
	const [grade, setGrade] = nullableUseState<Grade>()

	const toast = useToast()
	const queryClient = useQueryClient()

	const periods = usePeriods();
	if (periods.isError)
		errorToast("Error loading Periods", toast, periods.error)

	const types = useTypes();
	if (types.isError)
		errorToast("Error loading Types", toast, types.error)

	const subjects = useSubjects();
	if (subjects.isError)
		errorToast("Error loading Subjects", toast, subjects.error)

	const noteRange = useNoteRange();
	if (noteRange.isError)
		errorToast("Error loading noteRange", toast, noteRange.error)

	const gradeModalDefaults = useGradeModalDefaults({
		onSuccess: (data) => {
			if (grade === null)
				setDefault(data)
		}
	});
	if (gradeModalDefaults.isError)
		errorToast("Error loading gradeModalDefaults", toast, gradeModalDefaults.error)

	const handleGradeSliderChange = (value: number | number[], grade: Grade, noteRange: NoteRange) => {
		setGrade({...grade, grade: Math.max(Math.min(Number(value), noteRange.to), noteRange.from)});
	};

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

	const handleCreateGrade = async (grade: Grade) => {
		await createGrade(grade, queryClient).then(() => {
			toastMessage("success", "Created Grade", toast)
			props.closeModal()
		}).catch((error) => {
			errorToast("Error creating Grade", toast, error)
		})
	}

	const setDefault = (defaults: GradeModalDefaults) => {
		setGrade({
			id: -1,
			confirmed: null,
			date: dayjs().format("YYYY-MM-DD"),
			grade: defaults.grade_default,
			subject: defaults.subject_default || 0,
			type: defaults.type_default || 0,
			period: defaults.period_default || 0,
			info: '',
			not_final: defaults.not_final_default,
			weight: 'Default'
		})
	}

	const handleClear = async (gradeModalDefaults: GradeModalDefaults) => {
		let oldGrade = Object.assign({}, grade)
		// @ts-ignore
		setDefault(gradeModalDefaults)

		const undo = () => {
			setGrade(oldGrade)
			toastMessage("success", "Undid clear Note window", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Cleared create Note window", toast, undo)
	}

	return (<Dialog open={props.open} onClose={props.closeModal} fullWidth maxWidth="md">
		<DialogTitle variant="h5">New Grade</DialogTitle>
		<DialogContent>
			{grade !== null && (
					<Paper elevation={4} variant="elevation" sx={{padding: 2, marginTop: 2}} square>
						<Grid container spacing={4} padding={2}>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Subject</Typography>
									{subjects.isSuccess && <Select value={grade.subject.toString()} margin="none" fullWidth
																			 onChange={(event) => handleSubjectSelectChange(event, grade)}>
										{subjects.data.map((subject) => {
											return <MenuItem sx={{color: subject.color}} value={subject.id}>{subject.name}</MenuItem>
										})}
									</Select>}
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Type</Typography>
									{types.isSuccess && <Select value={grade.type.toString()} margin="none" fullWidth
																		 onChange={(event) => handleTypeSelectChange(event, grade)}>
										{types.data.map((type) => {
											return <MenuItem sx={{color: type.color}} value={type.id}>{type.name}</MenuItem>
										})}
									</Select>}
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={4}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Period</Typography>
									{periods.isSuccess && <Select value={grade.period.toString()} margin="none" fullWidth
																			onChange={(event) => handlePeriodSelectChange(event, grade)}>
										{periods.data.map((period) => {
											return <MenuItem value={period.id}>
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
							<Grid item xs={12} sm={6} lg={12}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">Grade</Typography>
									{noteRange.isSuccess && <>
										<TextField value={grade.grade} type="number" fullWidth margin="none"
													  onChange={(event) => handleGradeInputChange(event, grade, noteRange.data)}/>
										<Slider value={grade.grade || undefined} color="secondary" min={noteRange.data.from} max={noteRange.data.to}
												  onChange={(event, value) => handleGradeSliderChange(value, grade, noteRange.data)}/>
									</>}
								</Stack>
							</Grid>
							<Grid item xs={12} sm={8} lg={9}>
								<Stack spacing={2} height={1}>
									<Typography variant="h6" fontWeight="normal">Info</Typography>
									<TextField multiline minRows={2} value={grade.info} type="text" fullWidth margin="none"
												  onChange={(event) => handleInfoInputChange(event, grade)}/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={4} lg={3}>
								<Stack spacing={1.5} height={1}>
									<Typography variant="h6" fontWeight="normal">Grade Weight</Typography>
									<FormGroup>
										<RadioGroup defaultValue="normal" value={grade.weight} onChange={(event) => handleWeightChange(event, grade)}>
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
			<Button onClick={props.closeModal} type="submit" variant="outlined" color="secondary">Close</Button>
			{grade !== null &&
					<Button onClick={() => handleCreateGrade(grade)} type="submit" variant="outlined" color="success">Create</Button>
			}
		</DialogActions>
	</Dialog>);
}

export default NewGradeModal