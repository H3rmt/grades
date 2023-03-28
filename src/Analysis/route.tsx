import { rootRoute } from '../ts/root'
import { lazy, Suspense } from 'react'
import { Route } from '@tanstack/react-router'
import Topbar from '../components/TopBar/Topbar'

function Analysis() {
	const Component = lazy(() => import('./Analysis'))

	return <>
		<Topbar name="Analysis"/>
		<Suspense>
			<Component />
		</Suspense>
	</>
}


export const analysisRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/analysis',
	component: Analysis,
})