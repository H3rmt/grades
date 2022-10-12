import React from 'react';
import {CTable, HeadCell} from "../components/table/table";

type testdata = {
	id: number
	name: string,
	other: number
}

function Analysis() {
	const testdataA: testdata[] = [
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
			label: "NAME",
			disablePadding: false,
			numeric: false
		},
		{
			id: "other",
			label: "OTHER",
			disablePadding: false,
			numeric: false
		}
	]

	return <CTable data={testdataA} headCells={header}/>
}

export default Analysis;