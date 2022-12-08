import * as React from 'react';
import {useEffect, useState} from 'react';
import {Grade, Period, Subject, Type} from "../entity";
import {loadGrades, loadPeriods, loadSubjects, loadTypes} from "../ts/load";
import {CTable} from "../components/table/table";
import {getCols} from "./table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Button, MenuItem, Select, SelectChangeEvent, Stack, Typography} from "@mui/material";
import {nullableUseState, reactSet} from "../ts/utils";
import CAppBar from "../components/AppBar/CAppBar";
import {deleteGrade} from "./delete";
import NewGradeModal from "../components/NewGradeModal/NewGradeModal";
import {NoteRange} from "../entity/config";
import {loadNoteRange} from "../components/NewGradeModal/loadDefaults";
import {editGrade} from "./edit";

type Props = {
	setOpenNav: reactSet<boolean>
}

export default function Overview(props: Props) {
	const [openModal, setOpenModal] = useState(false);

	const [grades, setGrades] = useState<Grade[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [types, setTypes] = useState<Type[]>([])
	const [periods, setPeriods] = useState<Period[]>([])

	const [noteRange, setNoteRange] = nullableUseState<NoteRange>()

	const [period, setPeriod] = useState("-1")

	const toast = useToast()

	const getGrades = async () => {
		await loadGrades().then((data) => {
			setGrades(data)
		}).catch((error) => {
			setGrades([])
			errorToast("Error loading Grades", toast, error)
		})
	}

	const getSubjects = async () => {
		await loadSubjects().then((data) => {
			setSubjects(data)
		}).catch((error) => {
			setSubjects([])
			errorToast("Error loading Subjects", toast, error)
		})
	}

	const getPeriods = async () => {
		await loadPeriods().then((data) => {
			setPeriods(data)
		}).catch((error) => {
			setPeriods([])
			errorToast("Error loading Periods", toast, error)
		})
	}

	const getTypes = async () => {
		await loadTypes().then((data) => {
			setTypes(data)
		}).catch((error) => {
			setTypes([])
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

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value)
	}

	const handleDeleteGrade = async (id: number) => {
		await deleteGrade(id).then(() => {
			toastMessage("success", "Deleted Grade", toast)
			// Todo: add undo
			getGrades()
		}).catch((error) => {
			errorToast("Error deleting Grade", toast, error)
		})
	}

	const handleEditGrade = async (grade: Grade) => {
		await editGrade(grade).then(async () => {
			toastMessage("success", "Edited Grade", toast)
			// TODO: add undo
			await getGrades()
		}).catch((error) => {
			errorToast("Error editing Grade", toast, error)
		})
	}

	useEffect(() => {
		getGrades()
		getTypes()
		getPeriods()
		getSubjects()
		getNoteRange()
	}, [])

	const periodsPlus = [{id: -1, name: "All", from: "", to: ""}].concat(periods)

	// filter by period
	const data = grades.filter(grade => grade.period === Number(period) || period == "-1")

	return (<>
				<CAppBar name="Overview" setOpenNav={props.setOpenNav} other={
					<Stack spacing={2} direction="row" alignItems="start">
						<Select color="secondary" variant="outlined" sx={{padding: 0}} value={period} size="small"
								  onChange={handlePeriodSelectChange}>
							{periodsPlus.map((period) => {
								return <MenuItem value={period.id}>
									{period.name}&nbsp;&nbsp;&nbsp;{period.from != "" && period.to != "" ? `${period.from} - ${period.to}` : ""}
								</MenuItem>
							})}
						</Select>

						<Button color="secondary" variant="contained" onClick={() => {
							setOpenModal(true)
						}}>New Grade</Button>
					</Stack>
				}/>
				{noteRange !== null &&
						<CTable data={data} cols={getCols(noteRange, subjects, types)} delete={handleDeleteGrade}
								  edit={handleEditGrade}/>
				}
				<NewGradeModal open={openModal} closeModal={() => {
					setOpenModal(false)
				}} onUpdate={getGrades}/>
			</>
	)
}