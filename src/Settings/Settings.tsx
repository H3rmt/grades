import {Button, Grid, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Slider, Stack, TextField, Typography} from '@mui/material';
import React, {ChangeEvent, useEffect, useState} from 'react';
import CAppBar from '../components/AppBar/CAppBar';
import {nullableUseState, reactSet} from "../ts/utils";
import {SettingsBox} from "../components/SettingsBox/SettingsBox";
import {CTable} from "../components/table/table";
import {loadPeriods, loadSubjects, loadTypes} from "../ts/load";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Info, Period, Subject, Type} from "../entity";
import {getPeriodCols, getSubjectCols, getTypeCols} from "./table";
import {createPeriod, createSubject, createType} from "./create";
import {createData} from "../components/table/util";
import {deletePeriod, deleteSubject, deleteType} from "./delete";
import {editPeriod, editSubject, editType} from "./edit";
import {loadDefaults, loadNoteRange} from "../components/NewGradeModal/loadDefaults";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import SaveButton from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import {saveDefaults, saveNoteRange} from "./save";
import {loadInfo} from "./load";

type Props = {
	setOpenNav: reactSet<boolean>
}


function Settings(props: Props) {
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [types, setTypes] = useState<Type[]>([])
	const [periods, setPeriods] = useState<Period[]>([])

	const [noteRange, setNoteRange] = nullableUseState<NoteRange>()
	const [defaults, setDefaults] = nullableUseState<GradeModalDefaults>()

	const [info, setInfo] = nullableUseState<Info>()

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
		}).catch((error) => {
			setPeriods([])
			errorToast("Error loading Periods", toast, error)
		})
	}

	const getTypes = async () => {
		await loadTypes().then((data) => {
			setTypes(data)
		}).catch((error) => {
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

	const getDefaults = async () => {
		await loadDefaults().then((data) => {
			setDefaults(data)
		}).catch((error) => {
			errorToast("Error loading Defaults", toast, error)
		})
	}

	const getInfo = async () => {
		await loadInfo().then((data) => {
			setInfo(data)
		}).catch((error) => {
			errorToast("Error loading Data", toast, error)
		})
	}


	const handleCreateType = async () => {
		await createType(types).then(async () => {
			toastMessage("success", "Created Type", toast)
			await getTypes()
		}).catch((error) => {
			errorToast("Error creating Type", toast, error)
		})
	}

	const handleDeleteType = async (id: number) => {
		await deleteType(id).then(async () => {
			toastMessage("success", "Deleted Type", toast)
			// TODO: add undo
			await getTypes()
		}).catch((error) => {
			errorToast("Error deleting Type", toast, error)
		})
	}

	const handleEditType = async (period: Type) => {
		await editType(period).then(async () => {
			toastMessage("success", "Edited Type", toast)
			// TODO: add undo
			await getTypes()
		}).catch((error) => {
			errorToast("Error editing Type", toast, error)
		})
	}

	const handleCreateSubject = async () => {
		await createSubject(subjects).then(async () => {
			toastMessage("success", "Created Subject", toast)
			await getSubjects()
		}).catch((error) => {
			errorToast("Error creating Subject", toast, error)
		})
	}

	const handleDeleteSubject = async (id: number) => {
		await deleteSubject(id).then(async () => {
			toastMessage("success", "Deleted Subject", toast)
			// TODO: add undo
			await getSubjects()
		}).catch((error) => {
			errorToast("Error deleting Subject", toast, error)
		})
	}

	const handleEditSubject = async (subject: Subject) => {
		await editSubject(subject).then(async () => {
			toastMessage("success", "Edited Subject", toast)
			// TODO: add undo
			await getSubjects()
		}).catch((error) => {
			errorToast("Error editing Subject", toast, error)
		})
	}


	const handleCreatePeriod = async () => {
		await createPeriod(periods).then(async () => {
			toastMessage("success", "Created Period", toast)
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
		await editPeriod(period).then(async () => {
			toastMessage("success", "Edited Period", toast)
			// TODO: add undo
			await getPeriods()
		}).catch((error) => {
			errorToast("Error editing Period", toast, error)
		})
	}

	const handleNoteRangeToInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setNoteRange({// @ts-ignore
			from: Math.min(noteRange.from, Math.max(Math.min(Number(event.target.value), 30), 1) - 1),
			to: Math.max(Math.min(Number(event.target.value), 30), 1)
		})
	}

	const handleNoteRangeToSliderChange = async (event: Event, newValue: number | number[]) => {
		setNoteRange({// @ts-ignore
			from: Math.min(noteRange.from, newValue - 1),
			to: Number(newValue)
		})
	}

	const handleNoteRangeFromInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setNoteRange({// @ts-ignore
			to: Math.max(noteRange.to, Math.max(Math.min(Number(event.target.value), 29), 0) + 1),
			from: Math.max(Math.min(Number(event.target.value), 29), 0)
		})
	}

	const handleNoteRangeFromSliderChange = async (event: Event, newValue: number | number[]) => {
		setNoteRange({// @ts-ignore
			to: Math.max(noteRange.to, newValue + 1),
			from: Number(newValue)
		})
	}

	const handleSaveNoteRange = async () => {
		// @ts-ignore
		await saveNoteRange(noteRange).then(async () => {
			toastMessage("success", "Saved NoteRange", toast)
			// TODO: add undo
			await getNoteRange()
		}).catch((error) => {
			errorToast("Error saving NoteRange", toast, error)
		})
	}

	const handleNoteRangeReset = async () => {
		let old = Object.assign({}, noteRange)

		await getNoteRange()

		const undo = () => {
			setNoteRange(old)
			toastMessage("success", "Undid reset NoteRange", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Reset NoteRange", toast, undo)
	}

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		// @ts-ignore
		setDefaults({...defaults, period_default: Number(event.target.value)})
	}

	const handleTypeSelectChange = (event: SelectChangeEvent) => {
		// @ts-ignore
		setDefaults({...defaults, type_default: Number(event.target.value)})
	}

	const handleSubjectSelectChange = (event: SelectChangeEvent) => {
		// @ts-ignore
		setDefaults({...defaults, subject_default: Number(event.target.value)})
	}

	const handleSaveDefaults = async () => {
		// @ts-ignore
		await saveDefaults(defaults).then(async () => {
			toastMessage("success", "Saved NoteRange", toast)
			// TODO: add undo
			await getNoteRange()
		}).catch((error) => {
			errorToast("Error saving NoteRange", toast, error)
		})
	}

	const handleDefaultsReset = async () => {
		let old = Object.assign({}, defaults)

		await getDefaults()

		const undo = () => {
			setDefaults(old)
			toastMessage("success", "Undid reset Defaults", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Reset Defaults", toast, undo)
	}

	useEffect(() => {
		getTypes()
		getPeriods()
		getSubjects()
		getNoteRange()
		getDefaults()
		getInfo();

	}, [])

	return (<>
				<CAppBar name="Settings" setOpenNav={props.setOpenNav}/>
				<Grid container spacing={2} padding={2}>
					<Grid item xs={12} sm={12} md={6} xl={6}>
						<SettingsBox title="Types" top={
							<Button color="secondary" variant="contained" size="small" onClick={handleCreateType}>Add</Button>
						}><CTable data={createData(types)} cols={getTypeCols()} delete={handleDeleteType} edit={handleEditType}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={6} xl={6}>
						<SettingsBox title="Subjects" top={
							<Button color="secondary" variant="contained" size="small" onClick={handleCreateSubject}>Add</Button>
						}><CTable data={createData(subjects)} cols={getSubjectCols()} delete={handleDeleteSubject} edit={handleEditSubject}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={12} xl={6}>
						<SettingsBox title="Periods" top={
							<Button color="secondary" variant="contained" size="small" onClick={handleCreatePeriod}>Add</Button>
						}><CTable data={createData(periods)} cols={getPeriodCols()} delete={handleDeletePeriod} edit={handleEditPeriod}/>
						</SettingsBox>
					</Grid>
					{defaults !== undefined &&
							<Grid item xs={12} sm={12} md={6} xl={6}>
								<SettingsBox title="Defaults" top={
									<Stack direction="row">
										<IconButton color="error" onClick={handleDefaultsReset}>
											<UndoIcon/>
										</IconButton>
										<IconButton color="success" onClick={handleSaveDefaults}><SaveButton/>
										</IconButton>
									</Stack>
								}><Grid container spacing={4} padding={2}>
									<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
										<Stack spacing={2} direction="row" alignItems="center">
											<Typography variant="h6" fontWeight="normal">Type</Typography>
											<Select value={defaults.type_default?.toString() ?? ''} margin="none" fullWidth onChange={handleTypeSelectChange}>
												{types.map((type) => {
													return <MenuItem sx={{color: type.color}} value={type.id}>{type.name}</MenuItem>
												})}
											</Select>
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
										<Stack spacing={2} direction="row" alignItems="center">
											<Typography variant="h6" fontWeight="normal">Subject</Typography>
											<Select value={defaults.subject_default?.toString() ?? ''} margin="none" fullWidth
													  onChange={handleSubjectSelectChange}>
												{subjects.map((subject) => {
													return <MenuItem sx={{color: subject.color}} value={subject.id}>{subject.name}</MenuItem>
												})}
											</Select>
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={12} lg={12} xl={6}>
										<Stack spacing={2} direction="row" alignItems="center">
											<Typography variant="h6" fontWeight="normal">Period</Typography>
											<Select value={defaults.period_default?.toString() ?? ''} margin="none" fullWidth onChange={handlePeriodSelectChange}>
												{periods.map((period) => {
													return <MenuItem value={period.id}>
														<Stack>
															{period.name}
															<br/>
															<Typography variant="overline">{period.from} - {period.to}</Typography>
														</Stack>
													</MenuItem>
												})}
											</Select>
										</Stack>
									</Grid>
								</Grid>
								</SettingsBox>
							</Grid>
					}
					{noteRange !== undefined &&
							<Grid item xs={12} sm={12} md={6} xl={6}>
								<SettingsBox title="Note Range" top={
									<Stack direction="row">
										<IconButton color="error" onClick={handleNoteRangeReset}>
											<UndoIcon/>
										</IconButton>
										<IconButton color="success" onClick={handleSaveNoteRange}>
											<SaveButton/>
										</IconButton>
									</Stack>
								}>
									<Grid container spacing={4} padding={2}>
										<Grid item xs={12} sm={6} lg={6}>
											<Stack spacing={2}>
												<Typography variant="h6" fontWeight="normal">From</Typography>
												<TextField value={noteRange.from} type="number" fullWidth margin="none"
															  onChange={handleNoteRangeFromInputChange}/>
												<Slider value={noteRange.from} color="secondary" min={0} max={29}
														  onChange={handleNoteRangeFromSliderChange}/>
											</Stack>
										</Grid>
										<Grid item xs={12} sm={6} lg={6}>
											<Stack spacing={2}>
												<Typography variant="h6" fontWeight="normal">To</Typography>
												<TextField value={noteRange.to} type="number" fullWidth margin="none"
															  onChange={handleNoteRangeToInputChange}/>
												<Slider value={noteRange.to} color="secondary" min={1} max={30}
														  onChange={handleNoteRangeToSliderChange}/>
											</Stack>
										</Grid>
									</Grid>
								</SettingsBox>
							</Grid>
					}
					{info !== undefined &&
							<Grid item xs={12} sm={6} md={6} xl={6}>
								<SettingsBox title="Info">
									<Paper sx={{padding: 1, overflow: "auto"}} variant="outlined">
										<Stack spacing={1} direction="column">
											<Typography>
												name: {info.name}
											</Typography>
											<Typography>
												version: {info.version}
											</Typography>
											<Typography>
												authors: {info.authors}
											</Typography>
											<Typography>
												target: {info.target}
											</Typography>
											<Typography>
												profile: {info.profile}
											</Typography>
											<Typography>
												commit-hash: {info.commit_hash}
											</Typography>
										</Stack>
									</Paper>
								</SettingsBox>
							</Grid>
					}
				</Grid>
			</>
	)
}

export default Settings;