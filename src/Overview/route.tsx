import {rootRoute} from "../ts/root"
import {lazy, Suspense} from "react"
import {Route} from "@tanstack/react-router"

const Overview = lazy(() => import('./Overview'))

export const overviewRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/overview',
	component: () => <Suspense><Overview/></Suspense>,
  })