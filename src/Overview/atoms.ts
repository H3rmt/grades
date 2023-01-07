import { atom } from 'jotai'

export const modalOpen = atom(false)
export const modalConfirmed = atom(false)
export const period = atom<string | null>(null)

