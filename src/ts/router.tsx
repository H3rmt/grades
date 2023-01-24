import {ReactRouter} from '@tanstack/react-router'
import {overviewRoute} from "../Overview/Overview";
import {newGradeRoute} from "../Overview/NewGradeModal/NewGradeModal";
import {analysisRoute} from "../Analysis/Analysis";
import {settingsRoute} from "../Settings/Settings";
import {rootRoute} from "./root";

// <Info info={unsavedMessage} open={unsaved} setOpen={() => setUnsaved(false)} closeText="Continue Edit">
// 			<Button variant="contained" onClick={() => {
// 				setPage(unsavedNextPage)
// 				setUnsaved(false)
// 			}}>
// 				Discard Changes
// 			</Button>
// 		</Info>


const routeConfig = rootRoute.addChildren([
	overviewRoute,
	newGradeRoute,
	analysisRoute,
	settingsRoute
])

const router = new ReactRouter({
	routeConfig,
	onRouteChange: () => {
		// console.log("Route changed!")

	},
})

declare module '@tanstack/router/build/types/index' {
	interface RegisterRouter {
		router: typeof router
	}
}

declare module '@tanstack/react-router' {
	interface RegisterRouter {
		router: typeof router
	}
}


export {router}