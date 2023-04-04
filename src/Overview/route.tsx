import { rootRoute } from '../ts/root'
import { lazy, Suspense } from 'react'
import { Route } from '@tanstack/react-router'
import Topbar from '../components/TopBar/Topbar'
import { OverviewAppBar } from './OverviewAppBar'

function Overview() {
	const Component = lazy(() => import('./Overview'))

	return <>
		<Topbar name="Overview">
			<OverviewAppBar />
		</Topbar>
		<Suspense>
			<Component />
		</Suspense>
	</>
}


export const overviewRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/overview',
	component: Overview,
})