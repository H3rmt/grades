import {Button, MenuItem, Select, SelectChangeEvent, Stack, Typography, useMediaQuery} from "@mui/material"
import {useGradeModalDefaults, usePeriods} from "../commands/get"
import {forwardRef, useEffect} from "react"
import ReactQueryData from "../components/ReactQueryData/ReactQueryData"
import {Link} from "@tanstack/react-router"
import {NewGradeModalSearch} from "./NewGradeModal/NewGradeModal"
import {selectedPeriod} from "./atoms"


export function OverviewAppBar() {
	const oneButton = useMediaQuery('(max-width:700px)')
	const plusButton = useMediaQuery('(max-width:400px)')
	const period = selectedPeriod((state) => state.period)
	const setPeriod = selectedPeriod((state) => state.set)

	const [periods, , periodsS] = usePeriods()

	const [gradeModalDefaults] = useGradeModalDefaults()

	useEffect(() => {
		if (period === null && gradeModalDefaults !== undefined)
			setPeriod((gradeModalDefaults.period_default ?? "-1").toString())
	}, [gradeModalDefaults])

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value)
	}

	return <Stack spacing={2} direction="row" alignItems="center">
		<ReactQueryData query={periodsS} data={periods} display={(periods) =>
				<Select color="primary" autoWidth variant="outlined" sx={{maxWidth: [120, 150, 300, 500, 600]}}
						  value={period ?? "-1"} size="small" onChange={handlePeriodSelectChange} title="Period Select"
						  renderValue={(i: string) => (periods.find(p => p.id === Number(i))?.name ?? "All Periods")}>
					<MenuItem key="-1" value="-1">
						<Typography sx={{fontStyle: "italic"}}>All&nbsp;</Typography>
					</MenuItem>
					{periods.map((p) => <MenuItem key={p.id} value={p.id}>
						<Stack>
							{p.name}
							<br/>
							<Typography variant="overline">{p.from} - {p.to}</Typography>
						</Stack>
					</MenuItem>)
					}
				</Select>
		}/>
		{(() => {
			if (plusButton)
				return <></> // TODO ADD floating action Button
					// return <IconButton color="secondary" onClick={() => {
					// 	setConfirmed(false)
					// 	setOpen(true)
			// }} title="New Grade"><AddIcon/></IconButton>
			else if (oneButton)
				return <Button variant="contained" color="primary" component={RLink} to="/overview/newGrade" search={(old: NewGradeModalSearch) => {
					return {...old, confirmed: false}
				}} title="New Grade">New&nbsp;Grade</Button>
			else
				return <>
					<Button color="primary" variant="contained" component={RLink} to="/overview/newGrade" search={(old: NewGradeModalSearch) => {
						return {...old, confirmed: false}
					}} title="New Grade">New&nbsp;WIP&nbsp;Grade</Button>
					<Button color="primary" variant="contained" component={RLink} to="/overview/newGrade" search={(old: NewGradeModalSearch) => {
						return {...old, confirmed: true}
					}} title="New Grade">New&nbsp;Confirmed&nbsp;Grade</Button>
				</>
		})()}
	</Stack>
}

const RLink = forwardRef<HTMLAnchorElement, any>((itemProps, ref,) =>
		<Link role={undefined} ref={ref}  {...itemProps} />)