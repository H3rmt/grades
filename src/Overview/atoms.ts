import {create} from "zustand"

interface PeriodsState {
	period: string | null
	set: (by: string) => void
}

export const selectedPeriod = create<PeriodsState>(set => ({
	period: null,
	set: (by: string) => set({period: by})
}))
