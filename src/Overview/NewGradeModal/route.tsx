import {lazy, Suspense} from 'react'
import {overviewRoute} from '../route'
import {Route} from '@tanstack/react-router'


const NewGradeModal = lazy(() => import('./NewGradeModal'))

export const newGradeRoute = new Route({
	getParentRoute: () => overviewRoute,
	path: '/newGrade',
	component: () => <Suspense><NewGradeModal/></Suspense>,
})
