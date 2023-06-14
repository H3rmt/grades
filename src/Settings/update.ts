import {installUpdate, onUpdaterEvent, UpdateStatus} from '@tauri-apps/api/updater'
import {ProviderContext} from 'notistack'
import {errorToast} from '../components/Toast/toast'
import {Dispatch, SetStateAction} from 'react'
import {invoke} from '@tauri-apps/api'
import {Version} from '../entity/cache'

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

export const skipUpdate = async ({setAskUpdate, toast, nextVersion}: {
	setAskUpdate?: Dispatch<SetStateAction<boolean>>,
	toast: ProviderContext,
	nextVersion: Version
}) => {
	setAskUpdate?.(false)

	return await invoke<string>('edit_' + 'skip_version_in_cache' + '_js', {json: JSON.stringify(nextVersion)}).then((data) => {
		console.debug('edit_' + 'skip_version', 'success', data)
		return JSON.parse(data)
	}).catch((e) => {
		console.debug('edit_' + 'skip_version', 'fail', e)
		errorToast('Error skipping update', toast, e as string | Error)
		throw e as string | Error
	})
}