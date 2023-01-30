import {rootRoute} from "../../ts/root"
import {NewGradeModalSearch} from "./NewGradeModal"
import {lazy, Suspense} from "react"


const NewGradeModal = lazy(() => import('./NewGradeModal'))

export const newGradeRoute = rootRoute.createRoute<string, "newGrade", {}, NewGradeModalSearch>({
	path: 'newGrade',
	component: () => <Suspense><NewGradeModal/></Suspense>,
})

