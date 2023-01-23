import Topbar from "../components/TopBar/Topbar";
import {rootRoute} from "../ts/root";


export function Component() {
	return <>
		<div>
			Analysis<br/>
			Analysis<br/>
			Analysis<br/>
		</div>
	</>
}

export function Analysis() {
	return <>
		<Topbar name="Analysis"/>
		<Component/>
	</>
}

export const analysisRoute = rootRoute.createRoute({path: 'analysis', component: Analysis})
