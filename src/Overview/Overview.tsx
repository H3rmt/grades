import {useState} from 'react';
import {useGrades, useNoteRange, usePeriods, useSubjects, useTypes} from "../commands/get";
import {CTable} from "../components/table/table";
import {getCols} from "./table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Button, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";
import {reactSet} from "../ts/utils";
import CAppBar from "../components/AppBar/CAppBar";
import NewGradeModal from "../components/NewGradeModal/NewGradeModal";
import {useEditGrade} from "../commands/edit";
import {useQueryClient} from "@tanstack/react-query";
import {useDeleteGrade} from "../commands/delete";
import {Grade} from '../entity';

type Props = {
	setOpenNav: reactSet<boolean>
}

export default function Overview(props: Props) {
	const [openModal, setOpenModal] = useState(false);
	const [period, setPeriod] = useState("-1")

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
				<NewGradeModal open={openModal} closeModal={() => {
					setOpenModal(false)
				}}/>
			</>
	)
}