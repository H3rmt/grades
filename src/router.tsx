import {createBrowserHistory, Navigate, ReactRouter, Route} from '@tanstack/react-router'
import {overviewRoute} from "./Overview/route"
import {newGradeRoute} from "./Overview/NewGradeModal/route"
import {analysisRoute} from "./Analysis/route"
import {settingsRoute} from "./Settings/route"
import {navBarOpen} from "./atoms"
import {rootRoute} from "./ts/root"

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
	component: () => <Navigate to="/overview"></Navigate>,
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