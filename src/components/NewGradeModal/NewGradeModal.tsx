import React, {ChangeEvent, useEffect, useState} from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Slider,
	TextField,
	Typography
} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";
import {loadTypes} from "./load";
import {Subject} from "../../entity/subject";
import {Type} from "../../entity/type";
import {toastMessage, useToast} from "../../utils";

function NewGradeModal(props: { open: boolean, closeModal: () => void }) {
	const [grade, setGrade] = useState(12)
	const [subject, setSubject] = useState("")
	const [type, setType] = useState("")
	const [info, setInfo] = useState("")

	const [openToast, closeToast] = useToast()

	const [toast, setToast] = useState<string | undefined>(undefined)
	const [toastOpen, setToastOpen] = useState(false)

	const [subjects, setSubjects] = useState<Array<Subject>>([])
	const [types, setTypes] = useState<Array<Type>>([])

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

	const handleInfoInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInfo(event.target.value)
	}

	const createGrade = () => {
		invoke("create_grade_js", {
			json: JSON.stringify({
				grade: grade,
				subject: subject,
				type: type,
				info: info
			})
		}).then(() => {
			setToastOpen(true)
			console.log("Created new Grade")
			setToast("Created new Grade")
			props.closeModal()
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

	const getTypes = () => {
		// @ts-ignore
		loadTypes().then((data) => {
			setTypes(data)
		}).catch(() => {
			setTypes([])
			// TODO display error
		})

		const action = (id: any) => (<div style={{ gap: 1 }}>
			<Button variant="contained" color="secondary" onClick={() => {

			}}>
				Undo
			</Button>
			<Button variant="contained" color="secondary" onClick={() => {
				closeToast(id)
			}}>
				Dismiss
			</Button>
		</div>);

		let key = openToast(toastMessage("success", "TESTMESSAGE", {
			action: action
		}))
	}

	useEffect(() => {
		getSubjects()
		getTypes()
	}, [props.open])


	return (<Dialog open={props.open} onClose={props.closeModal}>
		<DialogTitle>Neue Note</DialogTitle>
		<DialogContent>
			<Paper elevation={4} variant="elevation" sx={{paddingTop: 1}}>
				<Grid container padding={1}>
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
							{types.map((type) => {
								return <MenuItem sx={{color: type.color}} value={type.id}>{type.name}</MenuItem>
							})}
						</Select>
					</Grid>
					<Grid item xs={6} gap={2} padding={2} paddingY={0} marginTop={2}>
						<Typography variant="h6" fontWeight="normal" paddingBottom={0}>Grade</Typography>
						<TextField value={grade} type="number" fullWidth margin="normal" onChange={handleGradeInputChange}/>
						<Slider value={grade} color="primary" min={0} max={15} onChange={handleGradeSliderChange}/>
					</Grid>
					<Grid item xs={6} gap={2} padding={2} paddingY={0} marginTop={2}>
						<Typography variant="h6" fontWeight="normal" paddingBottom={0}>Info</Typography>
						<TextField value={info} type="text" fullWidth margin="normal" onChange={handleInfoInputChange}/>
					</Grid>
				</Grid>
			</Paper>
		</DialogContent>
		<DialogActions>
			<Button onClick={createGrade}>Create</Button>
		</DialogActions>
	</Dialog>);
}

export default NewGradeModal