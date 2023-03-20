import { UpdateStatus } from '@tauri-apps/api/updater'
import {atom} from 'jotai'

export const updateStatus = atom<UpdateStatus | 'NONE'>('NONE')