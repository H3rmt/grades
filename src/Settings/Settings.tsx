import {Button, Grid, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Slider, Stack, TextField, Typography} from '@mui/material';
import {ChangeEvent, useState} from 'react';
import {nextFree, nullableUseState, randColor} from "../ts/utils";
import {CTable} from "../components/table/table";
import {errorToast, toastMessage} from "../ts/toast";
import {Period, Subject, Type} from "../entity";
import {getPeriodCols, getSubjectCols, getTypeCols} from "./table";
import {GradeModalDefaults, NoteRange} from "../entity/config";
import SaveButton from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import {useGradeModalDefaults, useInfo, useNoteRange, usePeriods, useSubjects, useTypes} from "../commands/get";
import {useQueryClient} from "@tanstack/react-query";
import {useCreatePeriod, useCreateSubject, useCreateType} from "../commands/create";
import dayjs from "dayjs";
import {useDeletePeriod, useDeleteSubject, useDeleteType} from "../commands/delete";
import {useEditGradeModalDefaults, useEditNoteRange, useEditPeriod, useEditSubject, useEditType} from "../commands/edit";
import {useSnackbar} from "notistack";
import SettingsBox from "../components/SettingsBox/SettingsBox";

type Props = {}


export default function Settings(props: Props) {
	const toast = useSnackbar()
	const queryClient = useQueryClient()

	const [periods, setPeriods] = useState<Period[]>([])
	const periodsS = usePeriods({
		onSuccess: (data) => setPeriods(data),
		onError: (error) => {
			errorToast("Error loading Periods", toast, error)
		}
	});

	const [types, setTypes] = useState<Type[]>([])
	const typesS = useTypes({
		onSuccess: (data) => setTypes(data),
		onError: (error) => {
			errorToast("Error loading Types", toast, error)
		}
	});

	const [subjects, setSubjects] = useState<Subject[]>([])
	const subjectsS = useSubjects({
		onSuccess: (data) => setSubjects(data),
		onError: (error) => {
			errorToast("Error loading Subjects", toast, error)
		}
	});

	const [noteRange, setNoteRange] = nullableUseState<NoteRange>()
	const noteRangeS = useNoteRange({
		onSuccess: (data) => setNoteRange(data),
		onError: (error) => {
			errorToast("Error loading noteRange", toast, error)
		}
	});

	const [gradeModalDefaults, setGradeModalDefaults] = nullableUseState<GradeModalDefaults>()
	const gradeModalDefaultsS = useGradeModalDefaults({
		onSuccess: (data) => setGradeModalDefaults(data),
		onError: (error) => {
			errorToast("Error loading gradeModalDefaults", toast, error)
		}
	});

	const info = useInfo({
		onError: (error) => {
			errorToast("Error loading info", toast, error)
		}
	});

	const createType = useCreateType(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Created Type", toast)
		},
		onError: (error) => {
			errorToast("Error creating Type", toast, error)
		}
	})

	const createSubject = useCreateSubject(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Created Subject", toast)
		},
		onError: (error) => {
			errorToast("Error creating Subject", toast, error)
		}
	})

	const createPeriod = useCreatePeriod(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Created Period", toast)
		},
		onError: (error) => {
			errorToast("Error creating Period", toast, error)
		}
	})

	const deleteType = useDeleteType(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Deleted Type", toast)
		},
		onError: (error) => {
			errorToast("Error deleting Type", toast, error)
		}
	})

	const deleteSubject = useDeleteSubject(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Deleted Subject", toast)
		},
		onError: (error) => {
			errorToast("Error deleting Subject", toast, error)
		}
	})

	const deletePeriod = useDeletePeriod(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Deleted Period", toast)
		},
		onError: (error) => {
			errorToast("Error deleting Period", toast, error)
		}
	})

	const editType = useEditType(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Edited Type", toast)
		},
		onError: (error) => {
			errorToast("Error editing Type", toast, error)
		}
	})

	const editSubject = useEditSubject(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Edited Subject", toast)
		},
		onError: (error) => {
			errorToast("Error editing Subject", toast, error)
		}
	})

	const editPeriod = useEditPeriod(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Edited Period", toast)
		},
		onError: (error) => {
			errorToast("Error editing Period", toast, error)
		}
	})

	const editNoteRange = useEditNoteRange(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Saved Note Range", toast)
		},
		onError: (error) => {
			errorToast("Error saving Note Range", toast, error)
		}
	})

	const editGradeModalDefaults = useEditGradeModalDefaults(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Saved Grade Modal Defaults", toast)
		},
		onError: (error) => {
			errorToast("Error saving Grade Modal Defaults", toast, error)
		}
	})


	const handleCreateType = async (types: Type[]) => {
		await createType.mutate({
			color: randColor(),
			name: nextFree(types.map(i => i.name), "New Type"),
			id: -1
		})
	}

	const handleCreateSubject = async (subjects: Subject[]) => {
		await createSubject.mutate({
			color: randColor(),
			name: nextFree(subjects.map(i => i.name), "New Subject"),
			id: -1
		})
	}

	const handleCreatePeriod = async (periods: Period[]) => {
		await createPeriod.mutate({
			to: dayjs().add(6, "months").format("DD-MM-YYYY"),
			from: dayjs().format("DD-MM-YYYY"),
			name: nextFree(periods.map(i => i.name), "New Period"),
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

	const handleGradeSliderChange = (event: Event, newValue: number | number[], gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, grade_default: Number(newValue)})
	}

	const handleGradeInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, gradeModalDefaults: GradeModalDefaults) => {
		setGradeModalDefaults({...gradeModalDefaults, grade_default: Number(event.target.value)})
	};

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

	return <Grid container spacing={2} padding={2}>
		{typesS.isSuccess && <Grid item xs={12} sm={12} md={6} xl={6}>
			<SettingsBox title="Types" top={
				<Button color="secondary" variant="contained" size="small" onClick={() => handleCreateType(types)}>Add</Button>
			}><CTable data={types} cols={getTypeCols()} delete={(id) => deleteType.mutate(id)}
						 edit={(type) => editType.mutate(type)}/>
			</SettingsBox>
		</Grid>
		}
		{subjectsS.isSuccess && <Grid item xs={12} sm={12} md={6} xl={6}>
			<SettingsBox title="Subjects" top={
				<Button color="secondary" variant="contained" size="small" onClick={() => handleCreateSubject(subjects)}>Add</Button>
			}><CTable data={subjects} cols={getSubjectCols()} delete={(id) => deleteSubject.mutate(id)}
						 edit={(subject) => editSubject.mutate(subject)}/>
			</SettingsBox>
		</Grid>
		}
		{periodsS.isSuccess && <Grid item xs={12} sm={12} md={12} xl={6}>
			<SettingsBox title="Periods" top={
				<Button color="secondary" variant="contained" size="small" onClick={() => handleCreatePeriod(periods)}>Add</Button>
			}><CTable data={periods} cols={getPeriodCols()} delete={(id) => deletePeriod.mutate(id)}
						 edit={(period) => editPeriod.mutate(period)}/>
			</SettingsBox>
		</Grid>
		}
		{gradeModalDefaults !== null && gradeModalDefaultsS.isSuccess && noteRange !== null &&
				<Grid item xs={12} sm={12} md={6} xl={6}>
					<SettingsBox title="Defaults" top={
						<Stack direction="row">
							<IconButton color="error" onClick={() => handleDefaultsReset(gradeModalDefaults, gradeModalDefaultsS.data)}>
								<UndoIcon/>
							</IconButton>
							<IconButton color="success" onClick={() => editGradeModalDefaults.mutate(gradeModalDefaults)}><SaveButton/>
							</IconButton>
						</Stack>
					}><Grid container spacing={4} padding={2}>
						<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Subject</Typography>
								<Select value={gradeModalDefaults.subject_default?.toString() ?? ''} margin="none" fullWidth
										  onChange={(e) => handleSubjectSelectChange(e, gradeModalDefaults)}>
									{subjects.map((subject) => {
										return <MenuItem value={subject.id} key={subject.id} sx={{color: subject.color}}>{subject.name}</MenuItem>
									})}
								</Select>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={12} lg={6} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Type</Typography>
								<Select value={gradeModalDefaults.type_default?.toString() ?? ''} margin="none" fullWidth
										  onChange={(e) => handleTypeSelectChange(e, gradeModalDefaults)}>
									{types.map((type) => {
										return <MenuItem value={type.id} key={type.id} sx={{color: type.color}}>{type.name}</MenuItem>
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
										return <MenuItem value={period.id} key={period.id}>
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
						<Grid item xs={12} sm={6} md={12} lg={12} xl={6}>
							<Stack spacing={2} direction="row" alignItems="center">
								<Typography variant="h6" fontWeight="normal">Grade</Typography>
								<Slider value={gradeModalDefaults.grade_default} color="secondary" min={noteRange.from} max={noteRange.to}
										  onChange={(e, v) => handleGradeSliderChange(e, v, gradeModalDefaults)}/>
								<TextField value={gradeModalDefaults.grade_default} type="number" margin="none"
											  onChange={(e) => handleGradeInputChange(e, gradeModalDefaults)}/>
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
							<IconButton color="success" onClick={() => editNoteRange.mutate(noteRange)}>
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
}