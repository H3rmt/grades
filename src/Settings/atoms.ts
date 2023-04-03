import {UpdateStatus} from '@tauri-apps/api/updater'
import {create} from 'zustand'

type UpdateState = {
	status: UpdateStatus | 'NONE'
	set: (by: UpdateStatus | 'NONE') => void
}

export const updateStatus = create<UpdateState>(set => ({
	status: 'NONE',
	set: (by: UpdateStatus | 'NONE') => set({status: by})
}))
