import {rootRoute} from "../ts/root";
import {lazy, Suspense} from "react";

const Analysis = lazy(() => import('./Analysis'));


export const analysisRoute = rootRoute.createRoute({
	path: 'analysis',
	component: () => <Suspense><Analysis/></Suspense>,
})
