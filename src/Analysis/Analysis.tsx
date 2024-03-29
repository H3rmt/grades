import {Grid} from '@mui/material'
import SubjectsOverPeriods from './SubjectsOverPeriods'
import GradesSumm from './GradesSum'

export default function Component() {
	return (<Grid container spacing={2} padding={2}>
		<Grid key={0} item xs={12} sm={12} md={12} xl={6}>
			<SubjectsOverPeriods/>
		</Grid>
		<Grid key={1} item xs={12} sm={12} md={12} xl={6}>
			<GradesSumm/>
		</Grid>
		{/*<Grid item xs={12} sm={12} md={6} xl={6}>
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
			</AnalysisBox>
		</Grid>*/}
	</Grid>
	)
}