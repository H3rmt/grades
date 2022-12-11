import {Button, Grid, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Slider, Stack, TextField, Typography} from '@mui/material';
import React, {ChangeEvent, useState} from 'react';
import CAppBar from '../components/AppBar/CAppBar';
import {nullableUseState, reactSet} from "../ts/utils";
import {SettingsBox} from "../components/SettingsBox/SettingsBox";
import {CTable} from "../components/table/table";
import {errorToast, toastMessage, useToast} from "../ts/toast";
import {Period, Subject, Type} from "../entity";
import {getPeriodCols, getSubjectCols, getTypeCols} from "./table";
import {createPeriod, createSubject, createType} from "./create";
import {createData} from "../components/table/util";
import {deletePeriod, deleteSubject, deleteType} from "./delete";
import {editPeriod, editSubject, editType} from "./edit";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import SaveButton from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import {saveGradeModalDefaults, saveNoteRange} from "./save";
import {useGradeModalDefaults, useInfo, useNoteRange, usePeriods, useSubjects, useTypes} from "../ts/load";
import {useQueryClient} from "@tanstack/react-query";

type Props = {
	setOpenNav: reactSet<boolean>
}


function Settings(props: Props) {
	const toast = useToast()
	const queryClient = useQueryClient()

	const [periods, setPeriods] = useState<Period[]>([])
	const periodsS = usePeriods({
		onSuccess: (data) => setPeriods(data)
	});
	if (periodsS.isError)
		errorToast("Error loading Periods", toast, periodsS.error)

	const [types, setTypes] = useState<Type[]>([])
	const typesS = useTypes({
		onSuccess: (data) => setTypes(data)
	});
	if (typesS.isError)
		errorToast("Error loading Types", toast, typesS.error)

	const [subjects, setSubjects] = useState<Subject[]>([])
	const subjectsS = useSubjects({
		onSuccess: (data) => setSubjects(data)
	});
	if (subjectsS.isError)
		errorToast("Error loading Subjects", toast, subjectsS.error)

	const [noteRange, setNoteRange] = nullableUseState<NoteRange>()
	const noteRangeS = useNoteRange({
		onSuccess: (data) => setNoteRange(data)
	});
	if (noteRangeS.isError)
		errorToast("Error loading noteRange", toast, noteRangeS.error)

	const [gradeModalDefaults, setGradeModalDefaults] = nullableUseState<GradeModalDefaults>()
	const gradeModalDefaultsS = useGradeModalDefaults({
		onSuccess: (data) => setGradeModalDefaults(data)
	});
	if (gradeModalDefaultsS.isError)
		errorToast("Error loading gradeModalDefaults", toast, gradeModalDefaultsS.error)

	const info = useInfo();
	if (info.isError)
		errorToast("Error loading noteRange", toast, info.error)


	const handleCreateType = async (types: Type[]) => {
		await createType(types, queryClient).then(async () => {
			toastMessage("success", "Created Type", toast)
		}).catch((error) => {
			errorToast("Error creating Type", toast, error)
		})
	}

	const handleDeleteType = async (id: number) => {
		await deleteType(id, queryClient).then(async () => {
			toastMessage("success", "Deleted Type", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error deleting Type", toast, error)
		})
	}

	const handleEditType = async (period: Type) => {
		await editType(period, queryClient).then(async () => {
			toastMessage("success", "Edited Type", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error editing Type", toast, error)
		})
	}

	const handleCreateSubject = async (subjects: Subject[]) => {
		await createSubject(subjects, queryClient).then(async () => {
			toastMessage("success", "Created Subject", toast)
		}).catch((error) => {
			errorToast("Error creating Subject", toast, error)
		})
	}

	const handleDeleteSubject = async (id: number) => {
		await deleteSubject(id, queryClient).then(async () => {
			toastMessage("success", "Deleted Subject", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error deleting Subject", toast, error)
		})
	}

	const handleEditSubject = async (subject: Subject) => {
		await editSubject(subject, queryClient).then(async () => {
			toastMessage("success", "Edited Subject", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error editing Subject", toast, error)
		})
	}


	const handleCreatePeriod = async (periods: Period[]) => {
		await createPeriod(periods, queryClient).then(async () => {
			toastMessage("success", "Created Period", toast)
		}).catch((error) => {
			errorToast("Error creating Period", toast, error)
		})
	}

	const handleDeletePeriod = async (id: number) => {
		await deletePeriod(id, queryClient).then(async () => {
			toastMessage("success", "Deleted Period", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error deleting Period", toast, error)
		})
	}

	const handleEditPeriod = async (period: Period) => {
		await editPeriod(period, queryClient).then(async () => {
			toastMessage("success", "Edited Period", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error editing Period", toast, error)
		})
	}

	const handleNoteRangeToInputChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, noteRange: NoteRange) => {
		setNoteRange({
			from: Math.min(noteRange.from, Math.max(Math.min(Number(event.target.value), 30), 1) - 1),
			to: Math.max(Math.min(Number(event.target.value), 30), 1)
		})
	}

	const handleNoteRangeToSliderChange = async (event: Event, newValue: number | number[], noteRange: NoteRange) => {
		setNoteRange({
			from: Math.min(noteRange.from, Number(newValue) - 1),
			to: Number(newValue)
		})
	}

	const handleNoteRangeFromInputChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, noteRange: NoteRange) => {
		setNoteRange({
			to: Math.max(noteRange.to, Math.max(Math.min(Number(event.target.value), 29), 0) + 1),
			from: Math.max(Math.min(Number(event.target.value), 29), 0)
		})
	}

	const handleNoteRangeFromSliderChange = async (event: Event, newValue: number | number[], noteRange: NoteRange) => {
		setNoteRange({
			to: Math.max(noteRange.to, Number(newValue) + 1),
			from: Number(newValue)
		})
	}

	const handleSaveNoteRange = async (noteRange: NoteRange) => {
		await saveNoteRange(noteRange, queryClient).then(async () => {
			toastMessage("success", "Saved NoteRange", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error saving NoteRange", toast, error)
		})
	}

	const handleNoteRangeReset = async (noteRange: NoteRange, noteRangeS: NoteRange) => {
		let old = Object.assign({}, noteRange)

		setNoteRange(noteRangeS)

		const undo = () => {
			setNoteRange(old)
			toastMessage("success", "Undid reset NoteRange", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Reset NoteRange", toast, undo)
	}

	const handlePeriodSelectChange = (event: SelectChangeEvent, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, period_default: Number(event.target.value)})
	}

	const handleTypeSelectChange = (event: SelectChangeEvent, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, type_default: Number(event.target.value)})
	}

	const handleSubjectSelectChange = (event: SelectChangeEvent, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, subject_default: Number(event.target.value)})
	}

	const handleSaveGradeModalDefaults = async (gradeModalDefaults: GradeModalDefaults) => {
		await saveGradeModalDefaults(gradeModalDefaults, queryClient).then(async () => {
			toastMessage("success", "Saved NoteRange", toast)
			// TODO: add undo
		}).catch((error) => {
			errorToast("Error saving NoteRange", toast, error)
		})
	}

	const handleDefaultsReset = async (gradeModalDefaults: GradeModalDefaults, gradeModalDefaultsS: GradeModalDefaults) => {
		let old = Object.assign({}, gradeModalDefaults)

		setGradeModalDefaults(gradeModalDefaultsS)

		const undo = () => {
			setGradeModalDefaults(old)
			toastMessage("success", "Undid reset Defaults", toast)
			closeClear()
		}

		let closeClear = toastMessage("warning", "Reset Defaults", toast, undo)
	}

	return (<>
				<CAppBar name="Settings" setOpenNav={props.setOpenNav}/>
				<Grid container spacing={2} padding={2}>
					<Grid item xs={12} sm={12} md={6} xl={6}>
						<SettingsBox title="Types" top={
							<Button color="secondary" variant="contained" size="small" onClick={() => handleCreateType(types)}>Add</Button>
						}><CTable data={createData(types)} cols={getTypeCols()} delete={handleDeleteType} edit={handleEditType}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={6} xl={6}>
						<SettingsBox title="Subjects" top={
							<Button color="secondary" variant="contained" size="small" onClick={() => handleCreateSubject(subjects)}>Add</Button>
						}><CTable data={createData(subjects)} cols={getSubjectCols()} delete={handleDeleteSubject} edit={handleEditSubject}/>
						</SettingsBox>
					</Grid>
					<Grid item xs={12} sm={12} md={12} xl={6}>
						<SettingsBox title="Periods" top={
							<Button color="secondary" variant="contained" size="small" onClick={() => handleCreatePeriod(periods)}>Add</Button>
						}><CTable data={createData(periods)} cols={getPeriodCols()} delete={handleDeletePeriod} edit={handleEditPeriod}/>
						</SettingsBox>
					</Grid>
					{gradeModalDefaults !== null && gradeModalDefaultsS.isSuccess &&
							<Grid item xs={12} sm={12} md={6} xl={6}>
								<SettingsBox title="Defaults" top={
									<Stack direction="row">
										<IconButton color="error" onClick={() => handleDefaultsReset(gradeModalDefaults, gradeModalDefaultsS.data)}>
											<UndoIcon/>
										</IconButton>
										<IconButton color="success" onClick={() => handleSaveGradeModalDefaults(gradeModalDefaults)}><SaveButton/>
										</IconButton>
									</Stack>
								}><Grid container spacing={4} padding={2}>
									<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
										<Stack spacing={2} direction="row" alignItems="center">
											<Typography variant="h6" fontWeight="normal">Type</Typography>
											<Select value={gradeModalDefaults.type_default?.toString() ?? ''} margin="none" fullWidth
													  onChange={(e) => handleTypeSelectChange(e, gradeModalDefaults)}>
												{types.map((type) => {
													return <MenuItem sx={{color: type.color}} value={type.id}>{type.name}</MenuItem>
												})}
											</Select>
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
										<Stack spacing={2} direction="row" alignItems="center">
											<Typography variant="h6" fontWeight="normal">Subject</Typography>
											<Select value={gradeModalDefaults.subject_default?.toString() ?? ''} margin="none" fullWidth
													  onChange={(e) => handleSubjectSelectChange(e, gradeModalDefaults)}>
												{subjects.map((subject) => {
													return <MenuItem sx={{color: subject.color}} value={subject.id}>{subject.name}</MenuItem>
												})}
											</Select>
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={12} lg={12} xl={6}>
										<Stack spacing={2} direction="row" alignItems="center">
											<Typography variant="h6" fontWeight="normal">Period</Typography>
											<Select value={gradeModalDefaults.period_default?.toString() ?? ''} margin="none" fullWidth
													  onChange={(e) => handlePeriodSelectChange(e, gradeModalDefaults)}>
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
					{noteRange !== null && noteRangeS.isSuccess &&
							<Grid item xs={12} sm={12} md={6} xl={6}>
								<SettingsBox title="Note Range" top={
									<Stack direction="row">
										<IconButton color="error" onClick={() => handleNoteRangeReset(noteRange, noteRangeS.data)}>
											<UndoIcon/>
										</IconButton>
										<IconButton color="success" onClick={() => handleSaveNoteRange(noteRange)}>
											<SaveButton/>
										</IconButton>
									</Stack>
								}>
									<Grid container spacing={4} padding={2}>
										<Grid item xs={12} sm={6} lg={6}>
											<Stack spacing={2}>
												<Typography variant="h6" fontWeight="normal">From</Typography>
												<TextField value={noteRange.from} type="number" fullWidth margin="none"
															  onChange={(e) => handleNoteRangeFromInputChange(e, noteRange)}/>
												<Slider value={noteRange.from} color="secondary" min={0} max={29}
														  onChange={(e, v) => handleNoteRangeFromSliderChange(e, v, noteRange)}/>
											</Stack>
										</Grid>
										<Grid item xs={12} sm={6} lg={6}>
											<Stack spacing={2}>
												<Typography variant="h6" fontWeight="normal">To</Typography>
												<TextField value={noteRange.to} type="number" fullWidth margin="none"
															  onChange={(e) => handleNoteRangeToInputChange(e, noteRange)}/>
												<Slider value={noteRange.to} color="secondary" min={1} max={30}
														  onChange={(e, v) => handleNoteRangeToSliderChange(e, v, noteRange)}/>
											</Stack>
										</Grid>
									</Grid>
								</SettingsBox>
							</Grid>
					}
					{info.isSuccess &&
							<Grid item xs={12} sm={6} md={6} xl={6}>
								<SettingsBox title="Info">
									<Paper sx={{padding: 1, overflow: "auto"}} variant="outlined">
										<Stack spacing={1} direction="column">
											<Typography>
												name: {info.data.name}
											</Typography>
											<Typography>
												version: {info.data.version}
											</Typography>
											<Typography>
												authors: {info.data.authors}
											</Typography>
											<Typography>
												target: {info.data.target}
											</Typography>
											<Typography>
												profile: {info.data.profile}
											</Typography>
											<Typography>
												commit-hash: {info.data.commit_hash}
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