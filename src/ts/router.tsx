import { ReactRouter } from '@tanstack/react-router'
import { overviewRoute } from "../Overview/route"
import { newGradeRoute } from "../Overview/NewGradeModal/route"
import { analysisRoute } from "../Analysis/route"
import { settingsRoute } from "../Settings/route"
import { rootRoute } from "./root"

import { Navigate, Route } from '@tanstack/react-router'
import { useEffect } from 'react'
import { checkUpdate } from '@tauri-apps/api/updater'
import { useSnackbar } from 'notistack'
import { toastMessage } from './toast'
import { Button } from '@mui/material'
import { update } from '../Settings/update'

// <Info info={unsavedMessage} open={unsaved} setOpen={() => setUnsaved(false)} closeText="Continue Edit">
// 			<Button variant="contained" onClick={() => {
// 				setPage(unsavedNextPage)
// 				setUnsaved(false)
// 			}}>
// 				Discard Changes
// 			</Button>
// 		</Info>

// navigate to cached route
let indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => {
		const toast = useSnackbar()

		useEffect(() => {
			const check = async () => {
				const { shouldUpdate, manifest } = await checkUpdate()
				console.log("UPDATE", shouldUpdate);
				
				if (shouldUpdate) {
					toastMessage("info", `Update available`, toast, undefined, manifest?.body ?? '', undefined,
						<Button variant="outlined" color='success' onClick={() => update({toast})} >
							Update
						</Button>
					)
				}
			}
			check()
		}, [])
		return <>
			<Navigate to="/overview"></Navigate>
		</>
	},
})


const routeTree = rootRoute.addChildren([
	indexRoute,
	overviewRoute.addChildren([
		newGradeRoute
	]),
	analysisRoute,
	settingsRoute
])

const router = new ReactRouter({
	routeTree,
	onRouteChange: () => {

	}
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export { router }