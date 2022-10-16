import React from 'react';
import {reactSet} from "../ts/utils";
import CAppBar from "../ts/CAppBar";

type testdata = {
	id: number
	name: string,
	other: number
}

type Props = {
	setOpenNav: reactSet<boolean>
}


function Settings(props: Props) {



	return (
			<>
				<CAppBar name="Settings" setOpenNav={props.setOpenNav} other={
					<></>
				}/>
				FEF
			</>
	)
}

export default Settings;