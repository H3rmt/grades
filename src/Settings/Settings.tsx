import {Button, Grid} from '@mui/material';
import React, {useEffect, useState} from 'react';
import CAppBar from '../components/AppBar/CAppBar';
import {reactSet} from "../ts/utils";
import {SettingsBox} from "../components/SettingsBox/SettingsBox";
import {CTable} from "../components/table/table";
import {loadPeriods, loadSubjects, loadTypes} from "../ts/load";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Period, Subject, Type} from "../entity";
import {getPeriodCols, getSubjectCols, getTypeCols} from "./table";

type Props = {
	setOpenNav: reactSet<boolean>
}


function Settings(props: Props) {
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [types, setTypes] = useState<Type[]>([])
	const [periods, setPeriods] = useState<Period[]>([])

	const toast = useToast()

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
		}).catch(() => {
			setPeriods([])
			toastMessage("error", "Error loading Periods", toast)
		})
	}

	const getTypes = async () => {
		await loadTypes().then((data) => {
			setTypes(data)
		}).catch((error) => {
			errorToast("Error loading Types", toast, error)
		})
	}

	useEffect(() => {
		getTypes()
		getPeriods()
		getSubjects()
	}, [])

	return (<>
				<CAppBar name="Settings" setOpenNav={props.setOpenNav} other={
					<></>
				}/>
				<Grid container spacing={2} padding={2}>
					<Grid item xs={12} sm={12} md={6} xl={4}>
						<SettingsBox title="Types" top={
							<Button color="secondary" variant="contained" size="small">Add</Button>
						}>
							<CTable data={types} cols={getTypeCols()}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={6} xl={4}>
						<SettingsBox title="Subjects" top={
							<Button color="secondary" variant="contained" size="small">Add</Button>
						}>
							<CTable data={subjects} cols={getSubjectCols()}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={6} xl={4}>
						<SettingsBox title="Periods" top={
							<Button color="secondary" variant="contained" size="small">Add</Button>
						}>
							<CTable data={periods} cols={getPeriodCols()}/>
						</SettingsBox>
					</Grid>
				</Grid>
			</>
	)
}

export default Settings;