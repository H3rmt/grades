import React from 'react';
import CAppBar from '../components/AppBar/CAppBar';
import {reactSet} from "../ts/utils";

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