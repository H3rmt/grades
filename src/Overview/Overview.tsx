import * as React from 'react';
import {useState} from 'react';
import {Grade} from "../entity";
import {useGrades, useNoteRange, usePeriods, useSubjects, useTypes} from "../ts/load";
import {CTable} from "../components/table/table";
import {getCols} from "./table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Button, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";
import {reactSet} from "../ts/utils";
import CAppBar from "../components/AppBar/CAppBar";
import {deleteGrade} from "./delete";
import NewGradeModal from "../components/NewGradeModal/NewGradeModal";
import {editGrade} from "./edit";
import {useQueryClient} from "@tanstack/react-query";

type Props = {
	setOpenNav: reactSet<boolean>
}

export default function Overview(props: Props) {
	const [openModal, setOpenModal] = useState(false);
	const [period, setPeriod] = useState("-1")

	const toast = useToast()
	const queryClient = useQueryClient()

	const grades = useGrades();
	if (grades.isError)
		errorToast("Error loading Grades", toast, grades.error)

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


	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value)
	}

	const handleDeleteGrade = async (id: number) => {
		await deleteGrade(id, queryClient).then(async () => {
			toastMessage("success", "Deleted Grade", toast)
			// Todo: add undo
		}).catch((error) => {
			errorToast("Error deleting Grade", toast, error)
		})
	}

	const handleEditGrade = async (grade: Grade) => {
		await editGrade(grade, queryClient).then(async () => {
			toastMessage("success", "Edited Grade", toast)
			// TODO: add undo
			await queryClient.invalidateQueries({queryKey: ["grades"]})
		}).catch((error) => {
			errorToast("Error editing Grade", toast, error)
		})
	}
	return (<>
				<CAppBar name="Overview" setOpenNav={props.setOpenNav} other={
					<Stack spacing={2} direction="row" alignItems="start">
						{periods.isSuccess && <Select color="secondary" variant="outlined" sx={{padding: 0}} value={period} size="small"
																onChange={handlePeriodSelectChange}>
							{[{id: -1, name: "All", from: "", to: ""}].concat(periods.data)
									.map((period) => {
										return <MenuItem value={period.id}>
											{period.name}&nbsp;&nbsp;&nbsp;{period.from != "" && period.to != "" ? `${period.from} - ${period.to}` : ""}
										</MenuItem>
									})}
						</Select>
						}
						<Button color="secondary" variant="contained" onClick={() => {
							setOpenModal(true)
						}}>New Grade</Button>
					</Stack>
				}/>
				{grades.isSuccess && subjects.isSuccess && types.isSuccess && noteRange.isSuccess && <CTable
						data={grades.data.filter(grade => grade.period === Number(period) || period == "-1")}
						cols={getCols(noteRange.data, subjects.data, types.data)} delete={handleDeleteGrade}
						edit={handleEditGrade}/>

				}
				<NewGradeModal open={openModal} closeModal={() => {
					setOpenModal(false)
				}}/>
			</>
	)
}