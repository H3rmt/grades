import React, {ChangeEvent, useEffect, useState} from 'react';
import {
	Alert,
	AlertTitle,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Slider,
	Snackbar,
	TextField,
	Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import "./NewGradleModal.css"
import {invoke} from "@tauri-apps/api/tauri";

type Subject = {
	id: number
	name: string
	color: string
}

function NewGradeModal(props: { open: boolean, closeModal: () => void }) {
	const [grade, setGrade] = useState(12)
	const [subject, setSubject] = useState("")
	const [type, setType] = useState("")

	const [toast, setToast] = useState<string | undefined>(undefined)
	const [toastOpen, setToastOpen] = useState(false)

	const [subjects, setSubjects] = useState<Array<Subject>>([])

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

	const createGrade = () => {
		invoke("create_grade_js", {
			json: JSON.stringify({
				grade: grade,
				subject: subject,
				type: type,
				info: "info"
			})
		}).then(() => {
			setToastOpen(true)
			console.log("Created new Grade")
			setToast("Created new Grade")
			// props.closeModal()
		}).catch((error) => {
			setToastOpen(true)
			console.error("Error creating Grade: " + error)
			setToast("Error creating Grade: " + error)
		})
	}

	const getSubjects = () => {
		// @ts-ignore
		invoke("get_subjects_js").then((data: string) => {
			console.log(data)
			setSubjects(JSON.parse(data))
		})
	}

	useEffect(() => {
		getSubjects()
	}, [])


	return (<Dialog open={props.open} onClose={props.closeModal}>
				<DialogTitle>Neue Note</DialogTitle>
				<DialogContent>
					<FormControl variant="outlined">
						<Grid container className="settingBox" padding={1}>
							<Grid item xs={6} gap={2} padding={2} paddingTop={0}>
								<Typography variant="h6" fontWeight="normal" paddingBottom={1.5}>Subject</Typography>
								<Select value={subject} margin="none" onChange={handleSubjectSelectChange} fullWidth>
									{subjects.map((subject) => {
										return <MenuItem sx={{color: subject.color}} value={subject.id}>{subject.name}</MenuItem>
									})}
								</Select>
							</Grid>
							<Grid item xs={6} gap={2} padding={2} paddingTop={0}>
								<Typography variant="h6" fontWeight="normal" paddingBottom={1.5}>Type</Typography>
								<Select value={type} margin="none" onChange={handleTypeSelectChange} fullWidth>
									<MenuItem value={1}>FEF</MenuItem>
									<MenuItem value={2}>FUF</MenuItem>
									<MenuItem value={3}>GRRR</MenuItem>
								</Select>
							</Grid>
							<Grid item xs gap={2} padding={2} paddingY={0} marginTop={2}>
								<Typography variant="h6" fontWeight="normal" paddingBottom={0}>Grade</Typography>
								{/* TODO correct margin + padding */}
								<TextField value={grade} type="number" fullWidth margin="normal" onChange={handleGradeInputChange}/>
								<Slider value={grade} color="primary" min={0} max={15} onChange={handleGradeSliderChange}/>
							</Grid>
						</Grid>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={createGrade}>Create</Button>
				</DialogActions>
				<Snackbar open={toastOpen} autoHideDuration={8000} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} onClose={() => {
					setToastOpen(false)
				}}>
					{toast && toast.startsWith("Created") ?
							<Alert severity="success" variant="outlined" action={
								<IconButton aria-label="close" size="small" onClick={() => {
									setToastOpen(false);
								}}><CloseIcon/>
								</IconButton>
							}>{toast}
								<AlertTitle>Success</AlertTitle>
							</Alert>
							:
							<Alert severity="error" variant="outlined" action={
								<IconButton aria-label="close" color="inherit" onClick={() => {
									setToastOpen(false);
								}}><CloseIcon/>
								</IconButton>
							}>{toast}
								<AlertTitle>Error</AlertTitle>
							</Alert>
					}
				</Snackbar>
			</Dialog>
	);
}

export default NewGradeModal