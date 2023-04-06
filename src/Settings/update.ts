import {installUpdate, onUpdaterEvent, UpdateStatus} from '@tauri-apps/api/updater'
import {ProviderContext} from 'notistack'
import {errorToast} from '../components/Toast/toast'
import {Dispatch, SetStateAction} from 'react'

export const update = async ({setAskUpdate, setUpdateState, toast}: {
	setAskUpdate?: Dispatch<SetStateAction<boolean>>,
	setUpdateState?: (update: UpdateStatus | 'NONE') => void
	toast: ProviderContext
}) => {
	setAskUpdate?.(false)

	const unlisten = await onUpdaterEvent(({status}) => {
		console.log(`updateFn : ${status}`)
		setUpdateState?.(status)
	})
	try {
		console.log('TRY install')
		await installUpdate()
	} catch (e) {
		errorToast('Error updating', toast, e as string | Error)
		console.error(`Error in try: ${e}`)
	} finally {
		unlisten()
	}
}
