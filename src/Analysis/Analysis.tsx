import {Grid, Typography} from "@mui/material";
import {AnalysisBox} from "../components/AnalysisBox/AnalysisBox";
import {Chart} from "../components/Chart/Chart";
import {ReferenceLine} from "recharts";
import Topbar from "../components/TopBar/Topbar";

type Props = {}


const data = [
	{
		name: 1,
		uv: 4000,
		pv: 2400,
	},
	{
		name: 2,
		uv: 3000,
		pv: 1398,
	},
	{
		name: 3,
		uv: 2000,
		pv: 9800,
	},
	{
		name: 4,
		uv: 2780,
		pv: 3908,
	},
	{
		name: 5,
		uv: 1890,
		pv: 4800,
	},
	{
		name: 6,
		uv: 2390,
		pv: 3800,
	},
	{
		name: 7,
		uv: 3490,
		pv: 4300,
	},
];

export function Component(props: Props) {
	return (<Grid container spacing={2} padding={2}>
				{/*
				<Grid item xs={12} sm={12} md={6} xl={6}>
					<AnalysisBox title="FEF" top={[
						<Typography variant="h6" color="inherit">
							FEF
						</Typography>, <Typography variant="h6" color="inherit">
							FEF s
						</Typography>
					]}>
						efef 1
					</AnalysisBox>
				</Grid>
				<Grid item xs={12} sm={12} md={6} xl={6}>
					<AnalysisBox title="FEF">
						efef 2
					</AnalysisBox>
				</Grid>
				<Grid item xs={12} sm={12} md={6} xl={6}>
					<AnalysisBox>
						efef 3
					</AnalysisBox>
				</Grid>
				*/}
				<Grid item xs={12} sm={12} md={12} xl={12}>
					<AnalysisBox top={[
						<Typography variant="h6" color="inherit">
							FEF
						</Typography>,
						<Typography variant="h6" color="inherit">
							FEF
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

export default function Analysis() {
	return <>
		<Topbar name="Analysis"/>
		<Component/>
	</>
}