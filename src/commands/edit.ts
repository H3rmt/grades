import {useUndefinedState} from '../ts/utils'
import {errorToast, toastMessage} from '../components/Toast/toast'
import {useQueryClient, UseQueryResult} from '@tanstack/react-query'
import {editMutation, query, resetMutation} from './commands'
import {Dispatch, SetStateAction} from 'react'
import {GradeModalDefaults, NoteRange} from '../entity/config'
import {useSnackbar} from 'notistack'


export function useEditGradeModalDefaults() {
	return edit<GradeModalDefaults>('grade_modal_defaults', 'New Grade Defaults')
}

export function useEditNoteRange() {
	return edit<NoteRange>('note_range', 'Note Range')
}

function edit<T>(key: string, name: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>, UseQueryResult<T, string | Error>, boolean, () => void, () => void, () => void] {
	const queryClient = useQueryClient()
	const toast = useSnackbar()

	const [edit, setEdit] = useUndefinedState<T>()

	const dataServer = query<T>(key, {
		onSuccess: (data) => setEdit(data),
		onError: (error) => {
			errorToast(`Error loading ${name}`, toast, error)
		}
	})

	const editServer = editMutation<T>(queryClient, key, {
		onSuccess: () => {
			toastMessage('success', `Saved ${name}`, toast)
		},
		onError: (error) => {
			errorToast(`Error saving ${name}`, toast, error)
		}
	})

	const resetServer = resetMutation(queryClient, key, {
		onSuccess: () => {
			toastMessage('success', `Reset ${name}`, toast)
		},
		onError: (error) => {
			errorToast(`Error resting ${name}`, toast, error)
		}
	})

	const reset = () => {
		const old = Object.assign({}, edit)
		setEdit(undefined)
		resetServer.mutate()
		const undo = () => {
			setEdit(old)
			toastMessage('success', `Undid reset ${name}`, toast)
			closeClear()
		}
		const closeClear = toastMessage('info', `Reset ${name}`, toast, undo)
	}

	const reload = () => {
		const old = Object.assign({}, edit)

		setEdit(dataServer.data ?? undefined)

		const undo = () => {
			setEdit(old)
			toastMessage('success', `Undid reload ${name}`, toast)
			closeClear()
		}

		const closeClear = toastMessage('warning', `Reloaded ${name}`, toast, undo)
	}

	const save = () => {
		if (edit !== undefined) {
			editServer.mutate(edit)
		} else {
			errorToast(`Error saving ${name}`, toast, 'No data to save')
		}
	}

	const changed = JSON.stringify(edit) !== JSON.stringify(dataServer.data)

	return [edit, setEdit, dataServer, changed, reset, reload, save]
}