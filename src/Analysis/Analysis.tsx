import React from 'react';
import {reactSet} from "../ts/utils";
import CAppBar from "../components/AppBar/CAppBar";

type Props = {
	setOpenNav: reactSet<boolean>
}


function Analysis(props: Props) {
	return (<>
				<CAppBar name="Analysis" setOpenNav={props.setOpenNav}/>
				<div>
					Analysis<br/>
					Analysis<br/>
					Analysis<br/>
				</div>
			</>
	)
}

export default Analysis;