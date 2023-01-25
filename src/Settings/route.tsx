import {rootRoute} from "../ts/root";
import {lazy, Suspense} from "react";

const Settings = lazy(() => import('./Settings'));

export const settingsRoute = rootRoute.createRoute({
	path: 'settings',
	component: () => <Suspense><Settings/> </Suspense>,
})
