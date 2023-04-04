import {useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from '../commands/get'
import {CTable} from '../components/Table/Table'
import {selectedPeriod} from './atoms'
import {getCols} from './table'
import {useEditGrades} from '../commands/editList'
import {loadingSpinner} from '../components/ReactQueryData/loadings'
import {Outlet} from '@tanstack/react-router'
import {NoteRange} from '../entity/config'
import {Grade, Period, Subject, Type, Weight} from '../entity'
import ReactQueryDataMultiple from '../components/ReactQueryData/ReactQueryDataMultiple'

export default function Component() {
	const period = selectedPeriod((state) => state.period)

	const [grades, , gradesS, , , editGrade, removeGrade] = useEditGrades()

	const [types, typesS] = useTypes()

	const [subjects, subjectsS] = useSubjects()

	const [weights, weightsS] = useWeights()

	const [noteRange, noteRangeS] = useNoteRange()

	const [periods, periodsS] = usePeriods()

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
				const grades = data[0]
				const noteRange = data[1]
				const subjects = data[2]
				const types = data[3]
				const weights = data[4]
				const periods = data[5]
				return <CTable
					data={grades.filter(grade => grade.period === Number(period) || period === '-1' && period !== null)}
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