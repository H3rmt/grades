import {createBrowserHistory, Navigate, ReactRouter, Route} from '@tanstack/react-router'
import {overviewRoute} from './Overview/route'
import {newGradeRoute} from './Overview/NewGradeModal/route'
import {analysisRoute} from './Analysis/route'
import {settingsRoute} from './Settings/route'
import {rootRoute} from './ts/root'
import {useEffect} from 'react'
import {checkUpdate} from '@tauri-apps/api/updater'
import {useSnackbar} from 'notistack'
import {Button} from '@mui/material'
import {update} from './Settings/update'
import {navBarOpen} from './atoms'
import {toastMessage} from './components/Toast/toast'

// <Info info={unsavedMessage} open={unsaved} setOpen={() => setUnsaved(false)} closeText="Continue Edit">
// 			<Button variant="contained" onClick={() => {
// 				setPage(unsavedNextPage)
// 				setUnsaved(false)
// 			}}>
// 				Discard Changes
// 			</Button>
// 		</Info>

// navigate to cached route
const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: () => {
		const toast = useSnackbar()

		useEffect(() => {
			const check = async () => {
				const {shouldUpdate, manifest} = await checkUpdate()
				console.log('UPDATE', shouldUpdate)

				if (shouldUpdate) {
					toastMessage('info', 'Update available', toast, undefined, {info: manifest?.body ?? '', title: `Update available ${manifest?.version}`}, undefined,
						<Button variant="outlined" color="success" onClick={() => update({toast})}>
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

const history = createBrowserHistory()
const router = new ReactRouter({
	history: history,
	routeTree,
	onRouteChange: () => {
		navBarOpen.setState({open: false})
	}
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export {router}