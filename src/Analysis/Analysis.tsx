import {Grid, Typography} from '@mui/material'
import {AnalysisBox} from '../components/AnalysisBox/AnalysisBox'
import {useGrades, useNoteRange, useSubjects} from '../commands/get'
import {useEffect, useState} from 'react'
import {Subject} from '../entity'
import dayjs from 'dayjs'
import SubjectsOverPeriods from './SubjectsOverPeriods'

type Props = {}

export default function Component(props: Props) {
	const [subjects, , subjectsS] = useSubjects()

	const [noteRange, , noteRangeS] = useNoteRange()

	const [subject, setSubject] = useState<Subject | null>(null)

	const [subjectData, setSubjectData] = useState<unknown | null>(null)

	const [grades, , gradesS] = useGrades()

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
						{/*<Chart data={data} lines={[{
							name: 'uv',
							color: 'red'
						}, {
							name: 'pv',
							color: 'orange'
						}]} extra={
							<ReferenceLine y={6000} label="Avg"/>
						}></Chart>*/}
					</AnalysisBox>
				</Grid>
			</Grid>
	)
}