import {useGrades, useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from '../../commands/get'
import {Grade, Period, Subject} from '../../entity'
import {useEffect, useState} from 'react'
import ReactQueryDataMultiple from '../../components/ReactQueryData/ReactQueryDataMultiple'
import {NoteRange} from '../../entity/config'
import {AnalysisBox} from '../../components/AnalysisBox/AnalysisBox'
import {Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import {Chart, Data} from '../../components/Chart/Chart'


export default function SubjectsOverPeriods() {
	const [subjects, subjectsS] = useSubjects()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [types, typesS] = useTypes()

	const [noteRange, noteRangeS] = useNoteRange()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [weights, weightsS] = useWeights()

	const [periods, periodsS] = usePeriods()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [grades, gradesS] = useGrades()

	const [subjectsSelected, setSubjectsSelected] = useState<Subject[]>([])

	const [data, setData] = useState<Data[]>([])


	useEffect(() => {
		// TODO: better error output
		if (subjectsSelected.length === 0 || grades === undefined || periods === undefined || weights === undefined || subjects === undefined || types === undefined)
			return

		// subject: [period: [grade]]
		const split: Grade[][][] = []

		grades.filter(grade => subjectsSelected.find(s => s.id === grade.subject) !== undefined)
			.filter(grade => grade.grade !== null)
			.forEach(grade =>
				split[grade.subject] ?
					split[grade.subject][grade.period] ?
						split[grade.subject][grade.period].push(grade) :
						(split[grade.subject][grade.period] = [grade]) :
					(split[grade.subject] = Array(grade.period + 1).fill(0).map((_, i) => i === grade.period ? [grade] : []))
			)

		// console.info(split)

		const data: Data[] = periods
			.map(period => {
				const d: { [key: string]: number } = {}

				subjectsSelected.map(subject => {
					const grades = split[subject.id]?.[period.id]
					if (grades === undefined)
						return
						// console.log('')
						// console.log(grades.length)
					const gradescount = grades
						.filter(grade => grade.type !== types.find(t => t.name === 'Klausur')?.id)
						.reduce((a, b) => {
							for (const weight of weights) {
								if (weight.name == b.weight)
									return a + Number(weight.value)
							}
							return a + 1 // one weight does always match
						}, 0)
						// console.log(gradescount)
					const gradesum = grades
						.filter(grade => grade.type !== types.find(t => t.name === 'Klausur')?.id)
						.reduce((a, b) => {
							for (const weight of weights) {
								if (weight.name == b.weight)
									return a + (b.grade ?? 0) * Number(weight.value)
							}
							return a + 1 // one weight does always match
						}, 0)
						// console.log(gradesum)

					const klausur = grades.find(grade => grade.type === types.find(t => t.name === 'Klausur')?.id)
					// console.log(klausur)

					// const final = ((gradescount !== 0 ? Math.round(gradesum / gradescount) : 0) + (klausur?.grade ?? 0)) / ((klausur !== undefined && gradescount !== 0) ? 2 : 1)
					const final = ((gradescount !== 0 ? (gradesum / gradescount) : 0) + (klausur?.grade ?? 0)) / ((klausur !== undefined && gradescount !== 0) ? 2 : 1)

					if (gradescount !== 0 || klausur !== undefined)
						d[subject.name] = Math.round((final + Number.EPSILON) * 100) / 100
				})

				return {
					x: period.name,
					data: d
				}
			})
			.sort((a, b) => a.x.localeCompare(b.x))

		setData(data)
	}, [subjectsSelected, subjects, grades, periods])

	return <ReactQueryDataMultiple<[Subject[], NoteRange, Period[]]>
		queries={[
			{query: subjectsS, data: subjects},
			{query: noteRangeS, data: noteRange},
			{query: periodsS, data: periods},
		]}
		display={(d) => {
			const subjects = d[0]
			const noteRange = d[1]

			return <AnalysisBox title="Subjects over Periods" top={[
				<FormGroup>{
					subjects.map((subject, index) =>
						<FormControlLabel control={
							<Checkbox checked={subjectsSelected.find(s => s.id === subject.id) !== undefined} onClick={() => {
								if (subjectsSelected.find(s => s.id === subject.id) !== undefined)
									setSubjectsSelected(subjectsSelected.filter(s => s.id !== subject.id))
								else
									setSubjectsSelected([...subjectsSelected, subject])
							}} key={index} sx={{color: subject.color, '&.Mui-checked': {color: subject.color}}}/>
						} label={subject.name} sx={{color: subject.color, padding: 1}}/>)
				}
				</FormGroup>
			]}>{subjects.length !== 0 && data !== null &&
						<Chart YAxisDomain={[noteRange.from, noteRange.to]} data={data} lines={
							subjectsSelected.map(subject => ({
								name: subject.name,
								color: subject.color,
							}))
						} height={400} width={600}></Chart>
				}
			</AnalysisBox>
		}
		}/>


}