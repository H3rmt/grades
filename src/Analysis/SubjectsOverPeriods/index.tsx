import {useGrades, useNoteRange, usePeriods, useSubjects} from "../../commands/get"
import {Grade, Period, Subject} from "../../entity"
import {useEffect, useState} from "react"
import ReactQueryDataMultiple from "../../components/ReactQueryData/ReactQueryDataMultiple"
import {NoteRange} from "../../entity/config"
import {AnalysisBox} from "../../components/AnalysisBox/AnalysisBox"
import {Typography} from "@mui/material"
import {Chart} from "../../components/Chart/Chart"

export default function SubjectsOverPeriods() {
	const [subjects, , subjectsS] = useSubjects()

	const [noteRange, , noteRangeS] = useNoteRange()

	const [periods, , periodsS] = usePeriods()

	const [subject, setSubject] = useState<Subject | null>(null)


	// [{x: "New Period", value: 7.25}, {x: "New Period 1", value: 6.5}]
	const [data, setData] = useState<unknown | null>([{x: "New Period", value: 7.25}, {x: "New Period 1", value: 6.5}])

	const [grades, , gradesS] = useGrades()

	useEffect(() => {
		if (subject === null || grades === undefined || periods === undefined)
			return

		const split: Grade[][] = []

		grades.filter(grade => grade.subject === subject.id)
				.forEach(grade => split[grade.period] ? split[grade.period].push(grade) : (split[grade.period] = [grade]))

		const data = []

		split.map(period => ({
			x: periods.find(p => p.id == period[0].period)?.name,
			value: period.reduce((a, b) => a + (b.grade ?? 0), 0) / period.length
		})).forEach(d => data.push(d))

		setData(data)
	}, [subject, grades, periods])

	return <ReactQueryDataMultiple<[Subject[], NoteRange, Period[]]>
			queries={[
				{query: subjectsS, data: subjects},
				{query: noteRangeS, data: noteRange},
				{query: periodsS, data: periods},
			]}
			display={(d) => {
				const subjects = d[0]
				const noteRange = d[1]

				console.log(data)

				return <AnalysisBox title="Compare Subjects" top={
					subjects.map((subject, index) =>
							<Typography onClick={() => {
								setSubject(subject)
							}} key={index} variant="h6" sx={{color: subject.color}}>
								{subject.name}
							</Typography>)
				}>{subject !== null && data !== null &&
						<Chart YAxisDomain={[noteRange.from, noteRange.to]} data={data} lines={[{
							name: 'value',
							color: subject.color
						}]} height={400} width={600}></Chart>
				}
				</AnalysisBox>
			}
			}/>


}