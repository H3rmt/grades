import {Grid, Typography} from "@mui/material"
import {AnalysisBox} from "../components/AnalysisBox/AnalysisBox"
import {Chart} from "../components/Chart/Chart"
import {ReferenceLine} from "recharts"
import {useGrades, useNoteRange, useSubjects} from "../commands/get"
import {useEffect, useState} from "react"
import {Subject} from "../entity"
import ReactQueryDataMultiple from "../components/ReactQueryData/ReactQueryDataMultiple"
import {NoteRange} from "../entity/config"
import dayjs from "dayjs"
import SubjectsOverPeriods from "./SubjectsOverPeriods"

type Props = {}

const data = [
	{
		date: 1,
		uv: 4000,
		pv: 2400,
	},
	{
		date: 2,
		uv: 3000,
		pv: 1398,
	},
	{
		date: 3,
		uv: 2000,
		pv: 9800,
	},
	{
		date: 4,
		uv: 2780,
		pv: 3908,
	},
	{
		date: 5,
		uv: 1890,
		pv: 4800,
	},
	{
		date: 6,
		uv: 2390,
		pv: 3800,
	},
	{
		date: 7,
		uv: 3490,
		pv: 4300,
	},
]

export default function Component(props: Props) {
	const [subjects, , subjectsS] = useSubjects()

	const [noteRange, , noteRangeS] = useNoteRange()

	const [subject, setSubject] = useState<Subject | null>(null)

	const [subjectData, setSubjectData] = useState<unknown | null>(null)

	const [grades, , gradesS] = useGrades()

	useEffect(() => {
		if (subject === null || grades === undefined)
			return

		setSubjectData(grades
				.filter(grade => grade.subject === subject.id)
				.filter(grade => grade.grade !== null) // @ts-ignore
				.sort((a, b) => dayjs(a.date, 'DD-MM-YYYY').diff(dayjs(b.date, 'DD-MM-YYYY')) < 0)
				.map(grade => ({
					date: grade.date,
					grade: grade.grade
				})))
	}, [subject, grades])

	return (<Grid container spacing={2} padding={2}>
				<Grid item xs={12} sm={12} md={12} xl={6}>
					<SubjectsOverPeriods/>
				</Grid>

				<Grid item xs={12} sm={12} md={6} xl={6}>
					<AnalysisBox title="TITLE">
						INTERN
					</AnalysisBox>
				</Grid>
				<Grid item xs={12} sm={12} md={6} xl={6}>
					<AnalysisBox>
						INTERN
					</AnalysisBox>
				</Grid>

				<Grid item xs={12} sm={12} md={12} xl={12}>
					<AnalysisBox top={[
						<Typography variant="h6" color="inherit">
							FEF
						</Typography>,
						<Typography variant="h6" color="inherit">
							FEF FEF FEF
						</Typography>
					]}>
						<Chart data={data} lines={[{
							name: 'uv',
							color: 'red'
						}, {
							name: 'pv',
							color: 'orange'
						}]} extra={
							<ReferenceLine y={6000} label="Avg"/>
						}></Chart>
					</AnalysisBox>
				</Grid>
			</Grid>
	)
}