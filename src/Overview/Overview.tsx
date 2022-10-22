import * as React from 'react';
import {useEffect, useState} from 'react';
import {Grade, Period, Subject, Type} from "../entity";
import {loadGrades, loadPeriods, loadSubjects, loadTypes} from "../ts/load";
import {CTable} from "../components/table/table";
import {getCols, transform} from "./table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Button, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";
import {reactSet} from "../ts/utils";
import CAppBar from "../components/AppBar/CAppBar";

type Props = {
	setOpenNav: reactSet<boolean>
	setOpenModal: reactSet<boolean>
}

const periodDefault = "-1"

export default function Overview(props: Props) {
	const [grades, setGrades] = useState<Grade[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [types, setTypes] = useState<Type[]>([])
	const [periods, setPeriods] = useState<Period[]>([])


	const [period, setPeriod] = useState(periodDefault)

	const toast = useToast()

	const getGrades = () => {
		loadGrades().then((data) => {
			setGrades(data)
		}).catch((error) => {
			setGrades([])
			errorToast("Error loading Grades", toast, error)
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

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value)
	}

	useEffect(() => {
		getGrades()
		getTypes()
		getPeriods()
		getSubjects()
	}, [])

	const periodsPlus = [{id: -1, name: "All", from: "", to: ""}].concat(periods)

	const filteredGrades = grades.filter(grade => grade.period === Number(period) || period == "-1")
	const data = transform(filteredGrades, subjects, types)

	return (<><CAppBar name="Overview" setOpenNav={props.setOpenNav} other={
				<Stack spacing={2} direction="row">
					<Select color="secondary" variant="outlined" sx={{padding: 0}} value={period} size="small"
							  onChange={handlePeriodSelectChange}>
						{periodsPlus.map((period) => {
							return <MenuItem value={period.id}>
								{period.name}&nbsp;&nbsp;&nbsp;{period.from != "" && period.to != "" ? `${period.from} - ${period.to}` : ""}
							</MenuItem>
						})}
					</Select>

					<Button color="secondary" variant="contained" onClick={() => {
						props.setOpenModal(true)
					}}>New Grade</Button>
				</Stack>
			}/>
				{/*// @ts-ignore*/}
				<CTable data={data} cols={getCols()}/>
			</>
	)
}