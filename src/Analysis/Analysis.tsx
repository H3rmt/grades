import Topbar from "../components/TopBar/Topbar"


export function Component() {
	return <>
		<div>
			Analysis<br/>
			Analysis<br/>
			Analysis<br/>
		</div>
	</>
}

export default function Analysis() {
	return <>
		<Topbar name="Analysis"/>
		<Component/>
	</>
}