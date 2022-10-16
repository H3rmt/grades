import React from 'react';
import {reactSet} from "../ts/utils";
import CAppBar from "../ts/CAppBar";
import {Button} from "@mui/material";

type Props = {
	setOpenNav: reactSet<boolean>
	setOpenModal: reactSet<boolean>
}


function Analysis(props: Props) {
	return (<>
				<CAppBar name="Analysis" setOpenNav={props.setOpenNav} other={
					<Button color="secondary" variant="contained" onClick={() => {
						props.setOpenModal(true)
					}}>New Grade</Button>
				}/>
				<div>
					Analysis<br/>
					Analysis<br/>
					Analysis<br/>
				</div>
			</>
	)
}

export default Analysis;