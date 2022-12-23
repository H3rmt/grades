import React, {useState} from 'react';
import {useGradeModalDefaults, useGrades, useNoteRange, usePeriods, useSubjects, useTypes} from "../commands/get";
import {CTable} from "../components/table/table";
import {getCols} from "./table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Button, IconButton, MenuItem, Select, SelectChangeEvent, Stack, useMediaQuery} from "@mui/material";
import {nullableUseState, reactSet} from "../ts/utils";
import CAppBar from "../components/AppBar/CAppBar";
import NewGradeModal from "../components/NewGradeModal/NewGradeModal";
import {useEditGrade} from "../commands/edit";
import {useQueryClient} from "@tanstack/react-query";
import {useDeleteGrade} from "../commands/delete";
import {Grade} from '../entity';
import AddIcon from '@mui/icons-material/Add';

type Props = {
	setOpenNav: reactSet<boolean>
}

export default function Overview(props: Props) {
	const [openModal, setOpenModal] = useState(false);
	const [openModalConfirmed, setOpenModalConfirmed] = useState(false);
	const [period, setPeriod] = nullableUseState<string>()

	const toast = useToast()
	const queryClient = useQueryClient()

	const grades = useGrades({
		onError: (error) => {
			errorToast("Error loading Grades", toast, error)
		}
	});

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
			if (period == null)
				setPeriod((data.period_default || "-1").toString())
		},
		onError: (error) => {
			errorToast("Error loading gradeModalDefaults", toast, error)
		}
	});

	const deleteGrade = useDeleteGrade(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Deleted Grade", toast)
		},
		onError: (error) => {
			errorToast("Error deleting grade", toast, error)
		}
	})

	const editGrade = useEditGrade(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Edited Grade", toast)
		},
		onError: (error) => {
			errorToast("Error editing grade", toast, error)
		}
	})

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value)
	}

	const oneButton = useMediaQuery('(max-width:600px)');
	const plusButton = useMediaQuery('(max-width:400px)');
	console.log(oneButton, plusButton)

	return (<>
				<CAppBar name="Overview" setOpenNav={props.setOpenNav} other={
					<Stack spacing={2} direction="row" alignItems="start">
						<Select color="secondary" variant="outlined" sx={{padding: 0}} value={period ?? "-1"} size="small"
								  onChange={handlePeriodSelectChange}>
							<MenuItem value="-1">
								All&nbsp;&nbsp;&nbsp;
							</MenuItem>
							{periods.isSuccess && periods.data.map((period) => {
								return <MenuItem value={period.id}>
									{period.name}&nbsp;&nbsp;&nbsp;{period.from != "" && period.to != "" ? `${period.from} - ${period.to}` : ""}
								</MenuItem>
							})}
						</Select>
						{(() => {
							if (plusButton)
								return <IconButton color="secondary" onClick={() => {
									setOpenModalConfirmed(false)
									setOpenModal(true)
								}}><AddIcon/></IconButton>
							else if (oneButton)
								return <Button variant="contained" color="secondary" onClick={() => {
									setOpenModalConfirmed(false)
									setOpenModal(true)
								}}>New&nbsp;Grade</Button>
							else
								return <>
									<Button color="secondary" variant="contained" onClick={() => {
										setOpenModalConfirmed(false)
										setOpenModal(true)
									}}>New&nbsp;WIP&nbsp;Grade</Button>
									<Button color="secondary" variant="contained" onClick={() => {
										setOpenModalConfirmed(true)
										setOpenModal(true)
									}}>New&nbsp;Confirmed&nbsp;Grade</Button>
								</>
						})()
						}

					</Stack>
				}/>
				{grades.isSuccess && subjects.isSuccess && types.isSuccess && noteRange.isSuccess &&
						<CTable data={grades.data.filter(grade => grade.period === Number(period) || period == "-1")}
								  cols={getCols(noteRange.data, subjects.data, types.data)}
								  delete={(id) => {
									  deleteGrade.mutate(id)
								  }}
								  edit={(grade: Grade) => {
									  editGrade.mutate(grade)
								  }}
						/>

				}
				<NewGradeModal open={openModal} confirmed={openModalConfirmed} closeModal={() => {
					setOpenModal(false)
				}}/>
			</>
	)
}