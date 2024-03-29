import {
	Button,
	Grid,
	IconButton,
	Link,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Slider,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import DownloadingIcon from '@mui/icons-material/Downloading'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {ChangeEvent, useEffect, useState} from 'react'
import {nextFree, randColor} from '../ts/utils'
import {CTable} from '../components/Table/Table'
import {Period, Subject, Type} from '../entity'
import {getPeriodCols, getSubjectCols, getTypeCols} from './table'
import {GradeModalDefaults, NoteRange} from '../entity/config'
import SaveButton from '@mui/icons-material/Save'
import {useInfo} from '../commands/get'
import dayjs from 'dayjs'
import SettingsBox from '../components/SettingsBox/SettingsBox'
import RestoreIcon from '@mui/icons-material/Restore'
import CloseIcon from '@mui/icons-material/Close'
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated'
import ReactQueryData from '../components/ReactQueryData/ReactQueryData'
import {useEditGradeModalDefaults, useEditNoteRange} from '../commands/edit'
import {useEditPeriods, useEditSubjects, useEditTypes} from '../commands/editList'
import {checkUpdate, UpdateManifest} from '@tauri-apps/api/updater'
import {Info} from '../components/Info/Info'
import {useSnackbar} from 'notistack'
import {updateStatus} from './atoms'
import {skipUpdate, update} from './update'

export default function Component() {
	const [noteRange, setNoteRange, noteRangeS, noteRangeEdited, resetNoteRange, reloadNoteRange, saveNoteRange] = useEditNoteRange()

	const [gradeModalDefaults, setGradeModalDefaults, gradeModalDefaultsS, gradeModalDefaultsEdited, resetGradeModalDefaults, reloadGradeModalDefaults, saveGradeModalDefaults] = useEditGradeModalDefaults()

	const [periods, , periodsS, , addPeriod, editPeriod, removePeriod] = useEditPeriods()

	const [subjects, , subjectsS, , addSubject, editSubject, removeSubject] = useEditSubjects()

	const [types, , typesS, , addType, editType, removeType] = useEditTypes()

	const [info, infoS] = useInfo()

	// usePromptWithNextLocation(
	// 	"Defaults for new Grade not saved, are you sure you want to leave?",
	// 	gradeModalDefaultsEdited
	// )
	//
	// usePromptWithNextLocation(
	// 	"NoteRange not saved, are you sure you want to leave?",
	// 	noteRangeEdited
	// )

	const handleCreateType = async (types: Type[]) => {
		addType({
			color: randColor(),
			name: nextFree(types.map(i => i.name), 'New Type'),
			id: -1
		})
	}

	const handleCreateSubject = async (subjects: Subject[]) => {
		addSubject({
			color: randColor(),
			name: nextFree(subjects.map(i => i.name), 'New Subject'),
			id: -1
		})
	}

	const handleCreatePeriod = async (periods: Period[]) => {
		addPeriod({
			from: dayjs().format('DD-MM-YYYY'),
			to: dayjs().add(6, 'months').format('DD-MM-YYYY'),
			name: nextFree(periods.map(i => i.name), 'New Period'),
			id: -1
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

	const handlePeriodSelectChange = (event: SelectChangeEvent<number>, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, period_default: Number(event.target.value) === -1 ? null : Number(event.target.value)})
	}

	const handleTypeSelectChange = (event: SelectChangeEvent<number>, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, type_default: Number(event.target.value) === -1 ? null : Number(event.target.value)})
	}

	const handleSubjectSelectChange = (event: SelectChangeEvent<number>, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, subject_default: Number(event.target.value) === -1 ? null : Number(event.target.value)})
	}

	const handleGradeSliderChange = (event: Event, newValue: number | number[], gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, grade_default: Number(newValue)})
	}

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, grade_default: Number(event.target.value)})
	}

	const [updateAvailable, setUpdateAvailable] = useState(false)
	const [updateManifest, setUpdateManifest] = useState<UpdateManifest | undefined>(undefined)
	const [askUpdate, setAskUpdate] = useState(false)

	const updateState = updateStatus((state) => state.status)
	const setUpdateState = updateStatus((state) => state.set)

	const toast = useSnackbar()

	const handleClickUpdate = () => {
		switch (updateState) {
		case 'NONE':
		case 'ERROR': {
			setAskUpdate(true)
			break
		}
		}
	}

	useEffect(() => {
		const check = async () => {
			const {shouldUpdate, manifest} = await checkUpdate()
			setUpdateAvailable(shouldUpdate)
			setUpdateManifest(manifest)
		}
		check()
	}, [])


	// useImperativeHandle(ref, () => ({
	// 	changed() {
	// 		if (gradeModalDefaultsEdited)
	// 			return [true, "Defaults for new Grade not saved"]
	// 		if (noteRangeEdited)
	// 			return [true, "NoteRange not saved"]
	// 		return [false, ""]
	// 	}
	// }));

	return <>
		<Grid container spacing={2} padding={2}>
			<Grid item xs={12} sm={12} md={6} xl={6}>
				<SettingsBox title="Types" top={
					<ReactQueryData query={typesS} data={types} display={(types) =>
						<Button variant="outlined" size="small" onClick={() => handleCreateType(types)}>Add</Button>
					}/>
				}><ReactQueryData query={typesS} data={types} display={(types) =>
						<CTable data={types} cols={getTypeCols()} delete={(id) => removeType(id)}
								  edit={(type) => editType(type)} title="Grade Type"/>
					} loadingHeight={100}/>
				</SettingsBox>
			</Grid>
			<Grid item xs={12} sm={12} md={6} xl={6}>
				<SettingsBox title="Subjects" top={
					<ReactQueryData query={subjectsS} data={subjects} display={(subjects) =>
						<Button variant="outlined" size="small" onClick={() => handleCreateSubject(subjects)}>Add</Button>
					}/>
				}><ReactQueryData query={subjectsS} data={subjects} display={(subjects) =>
						<CTable data={subjects} cols={getSubjectCols()} delete={(id) => removeSubject(id)}
								  edit={(subject) => editSubject(subject)} title="Subject"/>
					} loadingHeight={100}/>
				</SettingsBox>
			</Grid>
			<Grid item xs={12} sm={12} md={6} xl={6}>
				<SettingsBox title="Periods" top={
					<ReactQueryData query={periodsS} data={periods} display={(periods) =>
						<Button variant="outlined" size="small" onClick={() => handleCreatePeriod(periods)}>Add</Button>
					}/>
				}><ReactQueryData query={periodsS} data={periods} display={(periods) =>
						<CTable data={periods} cols={getPeriodCols()} delete={(id) => removePeriod(id)}
								  edit={(period) => editPeriod(period)} title="Period"/>
					} loadingHeight={100}/>
				</SettingsBox>
			</Grid>
			<Grid item xs={12} sm={12} md={6} xl={6}>
				<SettingsBox title="Defaults for new Grade" top={
					<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={() =>
						<Stack direction="row">
							<IconButton color="error" onClick={resetGradeModalDefaults}>
								<RestoreIcon/>
							</IconButton>
							{gradeModalDefaultsEdited &&
										<IconButton color="warning" onClick={reloadGradeModalDefaults}>
											<CloseIcon/>
										</IconButton>}
							<IconButton disabled={!gradeModalDefaultsEdited} color="success"
								onClick={saveGradeModalDefaults}><SaveButton/>
							</IconButton>
						</Stack>
					}/>
				}><Grid container spacing={4} padding={2}>
						<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Subject</Typography>
								<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={(gradeModalDefaults) =>
									<ReactQueryData query={subjectsS} data={subjects} display={(subjects) =>
										<Select color="secondary" value={gradeModalDefaults.subject_default ?? -1} margin="none"
													  fullWidth
													  onChange={(e) => handleSubjectSelectChange(e, gradeModalDefaults)}>
											<MenuItem value={-1} key={-1}>---</MenuItem>
											{subjects.map((subject) => {
												return <MenuItem value={subject.id} key={subject.id}
																		  sx={{color: subject.color}}>{subject.name}</MenuItem>
											})}
										</Select>
									}/>
								}/>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Type</Typography>
								<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={(gradeModalDefaults) =>
									<ReactQueryData query={typesS} data={types} display={(types) =>
										<Select color="secondary" value={gradeModalDefaults.type_default ?? -1} margin="none" fullWidth
													  onChange={(e) => handleTypeSelectChange(e, gradeModalDefaults)}>
											<MenuItem value={-1} key={-1}>---</MenuItem>
											{types.map((type) => {
												return <MenuItem value={type.id} key={type.id} sx={{color: type.color}}>{type.name}</MenuItem>
											})}
										</Select>
									}/>
								}/>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={12} lg={12} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Period</Typography>
								<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={(gradeModalDefaults) =>
									<ReactQueryData query={periodsS} data={periods} display={(periods) =>
										<Select color="secondary" value={gradeModalDefaults.period_default ?? -1} margin="none"
													  fullWidth
													  onChange={(e) => handlePeriodSelectChange(e, gradeModalDefaults)}>
											<MenuItem value={-1} key={-1}>---</MenuItem>
											{periods.map((period) => {
												return <MenuItem value={period.id} key={period.id}>
													<Stack>
														{period.name}
														<br/>
														<Typography variant="overline">{period.from} - {period.to}</Typography>
													</Stack>
												</MenuItem>
											})}
										</Select>
									}/>
								}/>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={12} lg={12} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Grade</Typography>
								<ReactQueryData query={gradeModalDefaultsS} data={gradeModalDefaults} display={(gradeModalDefaults) =>
									<ReactQueryData query={noteRangeS} data={noteRange} display={(noteRange) =>
										<>
											<Slider color="secondary" value={gradeModalDefaults.grade_default} min={noteRange.from}
														  max={noteRange.to}
														  onChange={(e, v) => handleGradeSliderChange(e, v, gradeModalDefaults)}/>
											<TextField color="secondary" value={gradeModalDefaults.grade_default} type="number" margin="none"
															  onChange={(e) => handleGradeInputChange(e, gradeModalDefaults)}/>
										</>
									}/>
								}/>
							</Stack>
						</Grid>
					</Grid>
				</SettingsBox>
			</Grid>
			<Grid item xs={12} sm={12} md={6} xl={6}>
				<SettingsBox title="Note Range" top={
					<ReactQueryData query={noteRangeS} data={noteRange} display={() =>
						<Stack direction="row">
							<IconButton color="error" onClick={resetNoteRange}>
								<RestoreIcon/>
							</IconButton>
							{noteRangeEdited &&
										<IconButton color="warning" onClick={reloadNoteRange}>
											<CloseIcon/>
										</IconButton>}
							<IconButton disabled={!noteRangeEdited} color="success" onClick={saveNoteRange}>
								<SaveButton/>
							</IconButton>
						</Stack>
					}/>
				}>
					<ReactQueryData query={noteRangeS} data={noteRange} display={(noteRange) =>
						<Grid container spacing={4} padding={2}>
							<Grid item xs={12} sm={6} lg={6}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">From</Typography>
									<TextField color="secondary" value={noteRange.from} type="number" fullWidth margin="none"
													  onChange={(e) => handleNoteRangeFromInputChange(e, noteRange)}/>
									<Slider color="secondary" value={noteRange.from} min={0} max={29}
												  onChange={(e, v) => handleNoteRangeFromSliderChange(e, v, noteRange)}/>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={6} lg={6}>
								<Stack spacing={2}>
									<Typography variant="h6" fontWeight="normal">To</Typography>
									<TextField color="secondary" value={noteRange.to} type="number" fullWidth margin="none"
													  onChange={(e) => handleNoteRangeToInputChange(e, noteRange)}/>
									<Slider color="secondary" value={noteRange.to} min={1} max={30}
												  onChange={(e, v) => handleNoteRangeToSliderChange(e, v, noteRange)}/>
								</Stack>
							</Grid>
						</Grid>
					}/>
				</SettingsBox>
			</Grid>

			<Grid item xs={12} sm={6} md={6} xl={6}>
				<SettingsBox title="Info" top={
					<Stack direction="row">
						<IconButton onClick={handleClickUpdate} disabled={!updateAvailable}>
							{(() => {
								switch (updateState) {
								case 'NONE':
									if (updateAvailable)
										return <BrowserUpdatedIcon color="info"/>
									else
										return <BrowserUpdatedIcon color="disabled"/>
								case 'DONE':
									return <CheckCircleOutlineIcon color="success"/>
								case 'PENDING':
									return <DownloadingIcon color="info"/>
								case 'ERROR':
									return <ReportGmailerrorredIcon color="error"/>
								}
							})()}
						</IconButton>
						{/*<IconButton onClick={handleClickSkipUpdate} disabled={!updateAvailable}>*/}
						{/*	<GitHubIcon/>*/}
						{/*</IconButton>*/}
					</Stack>
				}><ReactQueryData query={infoS} data={info} display={(info) =>
						<Paper sx={{padding: 1, overflow: 'auto'}} variant="outlined">
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
									build_on: {info.build_on}
								</Typography>
								<Link underline="hover" target="_blank" rel="noreferrer" color=""
									href={`${info.repository}commit/${info.commit_hash_short}`}>
									<Typography color="">
										commit_hash_short: {info.commit_hash_short}
									</Typography>
								</Link>
								<Typography>
									build_time: {dayjs(info.build_time).format('DD-MM-YYYY HH:mm:ss')}
								</Typography>
							</Stack>
						</Paper>
					} loadingHeight={150}
					/>
				</SettingsBox>
			</Grid>
		</Grid>
		<Info open={askUpdate} info={updateManifest?.body ?? ''} title="Update" setOpen={() => setAskUpdate(false)}>
			<Button variant="contained" color="success" onClick={() => update({setAskUpdate, setUpdateState, toast})}>
				Update
			</Button>
			<Button variant="contained" color="error"
					  onClick={() => skipUpdate({setAskUpdate, toast, nextVersion: {version: updateManifest?.version ?? '0.0.0'}})}>
				Skip Update
			</Button>
		</Info>
	</>
}