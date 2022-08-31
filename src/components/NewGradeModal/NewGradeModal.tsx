import React, {ChangeEvent, useState} from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	Slider,
	Stack,
	TextField
} from "@mui/material";

function NewGradeModal(props: { open: boolean, closeModal: () => void }) {
	const [grade, setGrade] = useState(15)
	const [subject, setSubject] = useState("")

	const handleGradeSliderChange = (event: Event, newValue: number | number[]) => {
		setGrade(newValue as number);
	};

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setGrade(Math.max(Math.min(Number(event.target.value), 15), 0));
	};

	const handleSubjectSelectChange = (event: SelectChangeEvent) => {
		setSubject(event.target.value)
	}

	return (<Dialog open={props.open} onClose={props.closeModal}>
		<DialogTitle>Neue Note</DialogTitle>
		<DialogContent>
			<FormControl variant="outlined">
				<Stack spacing={3}>
					<Select label="Subject" value={subject} margin="dense" onChange={handleSubjectSelectChange}>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						<MenuItem value={10}>Twenty</MenuItem>
					</Select>
					{/*Autocomplete*/}
					<Box>
						<TextField value={grade} type="number" margin="dense" label="Note" onChange={handleGradeInputChange}/>
						<Slider value={grade} color="primary" min={0} max={15} onChange={handleGradeSliderChange}/>
					</Box>
				</Stack>
			</FormControl>
		</DialogContent>
		<DialogActions>
			<Button onClick={props.closeModal}>Create</Button>
		</DialogActions>
	</Dialog>);
}

export default NewGradeModal