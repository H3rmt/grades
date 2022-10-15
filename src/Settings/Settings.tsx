import React from 'react';
import {CTable, HeadCell} from "../components/table/table";
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
	const data: testdata[] = [
		{
			id: 1,
			name: "geg",
			other: 12
		}, {
			id: 2,
			name: "fefefef",
			other: 14
		}
	]

	const header: HeadCell<testdata>[] = [
		{
			id: "name",
			label: "NAME"
		},
		{
			id: "other",
			label: "OTHER"
		}
	]

	return (
			<>
				<CAppBar name="Settings" setOpenNav={props.setOpenNav} other={
					<></>
				}/>
				<CTable headCells={header} data={data}/>
			</>
	)
}

export default Settings;