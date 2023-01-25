import {useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from "../commands/get";
import {CTable} from "../components/table/table";
import {useAtom} from 'jotai'
import {selectedPeriod} from "./atoms";
import {getCols} from "./table";
import {useEditGrades} from "../commands/editList";
import {loadingSpinner} from "../components/ReactQueryData/loadings";
import Topbar from "../components/TopBar/Topbar";
import {Outlet} from "@tanstack/react-router";
import {OverviewAppBar} from "./OverviewAppBar";
import {NoteRange} from "../entity/config";
import {Grade, Period, Subject, Type, Weight} from "../entity";
import ReactQueryDataMultiple from "../components/ReactQueryData/ReactQueryDataMultiple";

export function Component() {
	const [period] = useAtom(selectedPeriod);

	const [grades, , gradesS, , , editGrade, removeGrade] = useEditGrades();

	const [types, , typesS] = useTypes();

	const [subjects, , subjectsS] = useSubjects();

	const [weights, , weightsS] = useWeights();

	const [noteRange, , noteRangeS] = useNoteRange();

	const [periods, , periodsS] = usePeriods();

	return <>
		<ReactQueryDataMultiple<[Grade[], NoteRange, Subject[], Type[], Weight[], Period[]]>
				queries={[
					{query: gradesS, data: grades},
					{query: noteRangeS, data: noteRange},
					{query: subjectsS, data: subjects},
					{query: typesS, data: types},
					{query: weightsS, data: weights},
					{query: periodsS, data: periods}
				]}
				display={(data) => {
					let grades = data[0]
					let noteRange = data[1]
					let subjects = data[2]
					let types = data[3]
					let weights = data[4]
					let periods = data[5]
					return <CTable
							data={grades.filter(grade => grade.period === Number(period) || period === "-1" && period !== null)}
							cols={getCols(noteRange, subjects, types, weights, periods)}
							delete={removeGrade}
							edit={editGrade}
							title="OverviewTable"
					/>
				}}
				loading={loadingSpinner}/>
		<Outlet/>
	</>
}

export default function Overview() {
	return <>
		<Topbar name="Overview">
			<OverviewAppBar/>
		</Topbar>
		<Component/>
	</>
}