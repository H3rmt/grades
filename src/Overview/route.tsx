import {rootRoute} from "../ts/root"
import {lazy, Suspense} from "react"

const Overview = lazy(() => import('./Overview'))


export const overviewRoute = rootRoute.createRoute({
	path: '/',
	component: () => <Suspense><Overview/></Suspense>,
})
