import {create} from 'zustand'

interface NavBarOpenState {
	open: boolean
	set: (by: boolean) => void
}

export const navBarOpen = create<NavBarOpenState>(set => ({
	open: false,
	set: (by: boolean) => set({open: by})
}))
