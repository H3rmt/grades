import {createBrowserHistory, Navigate, ReactRouter, Route} from '@tanstack/react-router'
import {overviewRoute} from './Overview/route'
import {newGradeRoute} from './Overview/NewGradeModal/route'
import {analysisRoute} from './Analysis/route'
import {settingsRoute} from './Settings/route'
import {rootRoute} from './ts/root'
import {checkUpdate} from '@tauri-apps/api/updater'
import {useSnackbar} from 'notistack'
import {Button} from '@mui/material'
import {update} from './Settings/update'
import {navBarOpen} from './atoms'
import {toastMessage} from './components/Toast/toast'
import {usePageInCache, useSkipVersion} from './commands/cache'
import {invoke} from '@tauri-apps/api'
import {Page} from './entity'
// @ts-ignore
import {use} from 'react'

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

		const [page, pageS] = usePageInCache()
		const [version, versionS] = useSkipVersion()

		// check version
		// debugger
		if (versionS.isLoading) {
			return 'Loading.'
		}

		const {shouldUpdate, manifest} = use(Promise.resolve(checkUpdate()))
		console.log('UPDATE', shouldUpdate, manifest)

		// check if was not skipped
		if (version !== null && version !== undefined && version.version === manifest?.version) {
			console.log('skipped version', version.version)
			return
		}

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

		// redirect
		switch (page) {
		case undefined:
			return 'Loading...'
		case null:
			return <Navigate to="/overview"></Navigate>
		default:
			switch (page.name) {
			case '/overview':
				return <Navigate to="/overview"/>
			case '/analysis':
				return <Navigate to="/analysis"/>
			case '/settings':
				return <Navigate to="/settings"/>
			default:
				return <Navigate to="/overview"/>
			}
		}
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
	history,
	routeTree,
	onRouteChange: async () => {
		// close navbar
		navBarOpen.setState({open: false})

		console.log('route change')
		const page: Page = {name: router.state.currentLocation.pathname}

		return await invoke<string>('edit_' + 'page_in_cache' + '_js', {json: JSON.stringify(page)}).then((data) => {
			console.debug('edit_' + 'page_in_cache', 'success', page)
			return JSON.parse(data)
		}).catch((e) => {
			console.debug('edit_' + 'page_in_cache', 'fail', e, page)
			throw e as string | Error
		})
	}
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export {router}