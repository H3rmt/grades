import { emit, listen } from '@tauri-apps/api/event'
import { onUpdaterEvent, UpdateStatus } from '@tauri-apps/api/updater'
import { ProviderContext } from 'notistack'
import {errorToast} from '../components/Toast/toast'
import {Dispatch, SetStateAction} from 'react'

export const update = async ({setAskUpdate, setUpdateState, toast}: {
    setAskUpdate ?: Dispatch<SetStateAction<boolean>>,
    setUpdateState ?: (update: UpdateStatus | 'NONE') => void
    toast : ProviderContext
}) => {
	setAskUpdate?.(false)
	await listen('tauri://update-status', function (res) {
		console.log('New status: ', res)
	})
	const unlisten = await onUpdaterEvent(({ error, status }) => {
		console.log(status)
		if (status === 'ERROR') {
			errorToast('Error updating', toast, error as string | Error)
			console.log('unlisten')
			unlisten()
		}
		if (status === 'DONE') {
			console.log('unlisten')
			unlisten()
		}
		setUpdateState?.(status)
	})
	try {
		console.log('TRY install')
		await emit('tauri://update-install')
	} catch (e) {
		console.error(e)
	}
}
