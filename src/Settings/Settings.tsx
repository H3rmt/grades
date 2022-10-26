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
import {createPeriod} from "./create";
import {createData} from "../components/table/util";
import {deletePeriod} from "./delete";
import {editPeriod} from "./edit";

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

	const handlePeriodCreate = async () => {
		await createPeriod().then(async () => {
			toastMessage("success", "Created Period", toast)
			// TODO: add undo
			await getPeriods()
		}).catch((error) => {
			errorToast("Error creating Period", toast, error)
		})
	}

	const handleDeletePeriod = async (id: number) => {
		await deletePeriod(id).then(async () => {
			toastMessage("success", "Deleted Period", toast)
			// TODO: add undo
			await getPeriods()
		}).catch((error) => {
			errorToast("Error deleting Period", toast, error)
		})
	}

	const handleEditPeriod = async (period: Period) => {
		await editPeriod(period.id, period.name, period.from, period.to).then(async () => {
			toastMessage("success", "Edited Period", toast)
			// TODO: add undo
			await getPeriods()
		}).catch((error) => {
			errorToast("Error editing Period", toast, error)
		})
	}

	useEffect(() => {
		getTypes()
		getPeriods()
		getSubjects()
	}, [])

	return (<>
				<CAppBar name="Settings" setOpenNav={props.setOpenNav}/>
				<Grid container spacing={2} padding={2}>
					<Grid item xs={12} sm={12} md={6} xl={4}>
						<SettingsBox title="Types" top={
							<Button color="secondary" variant="contained" size="small">Add</Button>
						}>
							<CTable data={createData(types)} cols={getTypeCols()}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={6} xl={4}>
						<SettingsBox title="Subjects" top={
							<Button color="secondary" variant="contained" size="small">Add</Button>
						}>
							<CTable data={createData(subjects)} cols={getSubjectCols()}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={6} xl={4}>
						<SettingsBox title="Periods" top={
							<Button color="secondary" variant="contained" size="small" onClick={() => handlePeriodCreate()}>Add</Button>
						}>
							<CTable data={createData(periods)} cols={getPeriodCols()} delete={handleDeletePeriod} edit={handleEditPeriod}/>
						</SettingsBox>
					</Grid>
				</Grid>
			</>
	)
}

export default Settings;