import * as React from 'react';
import {useEffect, useState} from 'react';
import {Grade} from "../entity/grade";
import {loadGrades} from "./load";
import {CTable} from "../components/table/table";
import {headCells} from "./table";
import {errorToast, useToast} from "../utils";

export default function Overview() {
	const [grades, setGrades] = useState<Grade[]>([]);

	const toast = useToast()

	const getGrades = () => {
		loadGrades().then((data) => {
			setGrades(data)
		}).catch((error) => {
			setGrades([])
			errorToast("Error loading Grades", toast, error)
		})
	}

	useEffect(() => {
		getGrades()
	}, [])

	return (<CTable headCells={headCells} data={grades}/>)
}