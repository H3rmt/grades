import {useGrades, useNoteRange, usePeriods} from '../../commands/get'
import {useEffect, useState} from 'react'
import {Chart, Data} from '../../components/Chart/Chart'
import {Period} from '../../entity'
import ReactQueryDataMultiple from '../../components/ReactQueryData/ReactQueryDataMultiple'
import {AnalysisBox} from '../../components/AnalysisBox/AnalysisBox'
import {Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import {randColor} from '../../ts/utils'

type PeriodWithColor = Period & { color: string }

export default function GradesSumm() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [grades, gradesS] = useGrades()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [periods, periodsS] = usePeriods()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [noteRange, noteRangeS] = useNoteRange()

	const [periodsSelected, setPeriodsSelected] = useState<PeriodWithColor[]>([])

	const [data, setData] = useState<Data[]>([])
	const [max, setMax] = useState<number>(0)

	useEffect(() => {
		if (periodsSelected.length === 0 || grades === undefined || periods === undefined || noteRange === undefined)
			return

		// period: [grade: count]
		const split: number[][] = []

		// set 0 for each grade so that X axis is always same
		// for (let i = noteRange.from; i <= noteRange.to; i++) {
		// 	map.set(i, 0)
		// }


		grades.filter(grade => periodsSelected.find(s => s.id === grade.period) !== undefined)
			.filter(grade => grade.grade !== null)
			.forEach(grade =>
				split[grade.period] ? // @ts-ignore (already filtered)
					split[grade.period][grade.grade] ?  // @ts-ignore (already filtered)
						split[grade.period][grade.grade]++ :  // @ts-ignore (already filtered)
						(split[grade.period][grade.grade] = 1) :  // @ts-ignore (already filtered)
					(split[grade.period] = Array(grade.grade + 1).fill(0).map((_, i) => i === grade.grade ? 1 : 0))
			)

		// console.warn(split)

		let max = 1

		const data: Data[] = Array(noteRange.to - noteRange.from + 1).fill(0)
			.map((_, note) => {
				const d: { [key: string]: number } = {}

				periodsSelected.forEach(period => {
					// console.log('period', period, note, split, split[period.id], split[period.id][note])
					d[period.name] = split[period.id][note]

					if (split[period.id][note] > max)
						max = split[period.id][note]
				})

				return {x: note, data: d}
			})
			.sort((a, b) => b.x - a.x)

		// console.warn(data)

		setMax(max)
		setData(data)
	}, [periodsSelected, grades, periods, noteRange])

	return <ReactQueryDataMultiple<[Period[]]>
		queries={[
			{query: periodsS, data: periods},
		]}
		display={(d) => {
			const periods = d[0]

			return <AnalysisBox title="Grades Overview" top={[
				<FormGroup>{
					periods.map((period, index) =>
						<FormControlLabel control={
							<Checkbox checked={periodsSelected.find(s => s.id === period.id) !== undefined} onClick={() => {
								if (periodsSelected.find(s => s.id === period.id) !== undefined)
									setPeriodsSelected(periodsSelected.filter(s => s.id !== period.id))
								else
									setPeriodsSelected([...periodsSelected, Object.assign(period, {color: randColor()})])
							}} key={index}/>
						} label={period.name} sx={{padding: 1}}/>)
				}
				</FormGroup>
			]}>{<Chart YAxisDomain={[0, max + 1]} data={data} lines={
					periodsSelected.map(period => ({
						name: period.name,
						color: period.color,
					}))
				} height={400} width={600}></Chart>}
			</AnalysisBox>
		}}/>

}