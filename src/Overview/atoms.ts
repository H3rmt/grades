import {atom} from 'jotai'

export const modalOpen = atom(false)
export const modalConfirmed = atom(false)
export const selectedPeriod = atom<string | undefined>(undefined)

