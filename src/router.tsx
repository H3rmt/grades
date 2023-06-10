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
import {usePageInCache} from './commands/cache'

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

		const [page] = usePageInCache()
		useEffect(() => {
			const check = async () => {
				const {shouldUpdate, manifest} = await checkUpdate()
				console.log('UPDATE', shouldUpdate)

				if (shouldUpdate) {
					toastMessage('info', 'Update available', toast, undefined, {
						info: manifest?.body ?? '',
						title: `Update available ${manifest?.version}`
					}, undefined,
					<Button variant="outlined" color="success" onClick={() => update({toast})}>
								Update
					</Button>
					)
				}
			}
			check()
		}, [])
		return <>
			{(() => {
				switch (page) {
				case undefined:
					return 'loading...'
				case null:
					return <Navigate to="/overview"></Navigate>
				default:
					console.log('navigate to', {page})
					switch (page.name) {
					case '/overview':
						return <Navigate to="/overview"></Navigate>
					case '/analysis':
						return <Navigate to="/analysis"></Navigate>
					case '/settings':
						return <Navigate to="/settings"></Navigate>
					default:
						return <></>
					}
				}
			})()}
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
		// console.log('route change')

	}
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export {router}