import React, {ChangeEvent, useState} from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	MenuItem,
	Select,
	SelectChangeEvent,
	Slider,
	TextField,
	Typography
} from "@mui/material";
import "./NewGradleModal.css"


function NewGradeModal(props: { open: boolean, closeModal: () => void }) {
	const [grade, setGrade] = useState(12)
	const [subject, setSubject] = useState("")
	const [type, setType] = useState("")

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

	return (<Dialog open={props.open} onClose={props.closeModal}>
		<DialogTitle>Neue Note</DialogTitle>
		<DialogContent>
			<FormControl variant="outlined">
				<Grid container className="settingBox" padding={1}>
					<Grid item xs={6} gap={2} padding={2} paddingTop={0}>
						<Typography variant="h6" fontWeight="normal" paddingBottom={1.5}>Subject</Typography>
						<Select value={subject} margin="none" onChange={handleSubjectSelectChange} fullWidth>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</Grid>
					<Grid item xs={6} gap={2} padding={2} paddingTop={0}>
						<Typography variant="h6" fontWeight="normal" paddingBottom={1.5}>Type</Typography>
						<Select value={type} margin="none" onChange={handleTypeSelectChange} fullWidth>
							<MenuItem value={10}>FEF</MenuItem>
							<MenuItem value={20}>FUF</MenuItem>
							<MenuItem value={30}>GRRR</MenuItem>
						</Select>
					</Grid>
					<Grid item xs gap={2} padding={2} paddingY={0}>
						<Typography variant="h6" fontWeight="normal" paddingBottom={0}>Grade</Typography>
						{/* TODO correct margin + padding */}
						<TextField value={grade} type="number" fullWidth margin="normal" onChange={handleGradeInputChange}/>
						<Slider value={grade} color="primary" min={0} max={15} onChange={handleGradeSliderChange}/>
					</Grid>
				</Grid>
			</FormControl>
		</DialogContent>
		<DialogActions>
			<Button onClick={props.closeModal}>Create</Button>
		</DialogActions>
	</Dialog>);
}

export default NewGradeModal