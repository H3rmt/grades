import { rootRoute } from "../ts/root"
import { lazy, Suspense } from "react"
import {Route} from "@tanstack/react-router"

const Settings = lazy(() => import('./Settings'))

export const settingsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/settings',
	component: () => <Suspense><Settings /></Suspense>,
})