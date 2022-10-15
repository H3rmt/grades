import * as React from 'react';
import {useEffect, useState} from 'react';
import {Grade, Period, Subject, Type} from "../entity";
import {loadGrades, loadPeriods, loadSubjects, loadTypes} from "../ts/load";
import {CTable} from "../components/table/table";
import {header, transform} from "./table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Button} from "@mui/material";
import CAppBar from "../ts/CAppBar";
import {reactSet} from "../ts/utils";

type Props = {
	setOpenNav: reactSet<boolean>
	setOpenModal: reactSet<boolean>
}

export default function Overview(props: Props) {
	const [grades, setGrades] = useState<Grade[]>([]);
	const [subjects, setSubjects] = useState<Array<Subject>>([])
	const [types, setTypes] = useState<Array<Type>>([])
	const [periods, setPeriods] = useState<Array<Period>>([])

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

	useEffect(() => {
		getGrades()
		getTypes()
		getPeriods()
		getSubjects()
	}, [])

	const data = transform(grades, subjects, types)

	console.log(data)

	return (<>
				<CAppBar name="Overview" setOpenNav={props.setOpenNav} other={
					<Button color="secondary" variant="contained" onClick={() => {
						props.setOpenModal(true)
					}}>New Grade</Button>
				}/>
				<CTable headCells={header} data={data}/>
			</>
	)
}