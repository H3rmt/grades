import { ReactRouter } from '@tanstack/react-router'
import { overviewRoute } from "../Overview/route"
import { newGradeRoute } from "../Overview/NewGradeModal/route"
import { analysisRoute } from "../Analysis/route"
import { settingsRoute } from "../Settings/route"
import { rootRoute } from "./root"

import { Navigate, Route } from '@tanstack/react-router'

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