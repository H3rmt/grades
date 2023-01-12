import {ForwardedRef, forwardRef} from "react";
import {PageRef as Ref} from "../App";

type Props = {}


const Analysis = forwardRef(function (props: Props, ref: ForwardedRef<Ref>) {
	return <>
		<div>
			Analysis<br/>
			Analysis<br/>
			Analysis<br/>
		</div>
	</>
})

export default Analysis;