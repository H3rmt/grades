import { rootRoute } from "../ts/root"
import { lazy, Suspense } from "react"
import { Route } from "@tanstack/react-router"

const Analysis = lazy(() => import('./Analysis'))

export const analysisRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/analysis',
	component: () => <Suspense><Analysis /></Suspense>,
})