import { rootRoute } from "../ts/root"
import { lazy, Suspense } from "react"
import {Route} from "@tanstack/react-router"
import Topbar from "../components/TopBar/Topbar"

function Settings() {
	const Component = lazy(() => import('./Settings'))

	return <>
		<Topbar name="Settings"/>
		<Suspense>
			<Component />
		</Suspense>
	</>
}


export const settingsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/settings',
	component: Settings,
})