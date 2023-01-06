import {Button, IconButton, MenuItem, Select, SelectChangeEvent, Stack, Typography, useMediaQuery} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {usePeriods} from "../commands/get";
import {errorToast} from "../ts/toast";
import {modalConfirmed, modalOpen, period as Period} from "./atoms";
import {useAtom} from 'jotai'
import {useSnackbar} from "notistack";

type Props = {};

export default function OverviewAppBar(props: Props) {
	const oneButton = useMediaQuery('(max-width:700px)');
	const plusButton = useMediaQuery('(max-width:400px)');
	const [period, setPeriod] = useAtom(Period);
	const [, setOpen] = useAtom(modalOpen);
	const [, setConfirmed] = useAtom(modalConfirmed);

	const toast = useSnackbar()

	const periods = usePeriods({
		onError: (error) => {
			errorToast("Error loading Periods", toast, error)
		}
	});

	const handlePeriodSelectChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value);
	}

	return <Stack spacing={2} direction="row" alignItems="start">
		{periods.isSuccess && <Select color="secondary" variant="outlined" sx={{padding: 0, maxWidth: [120, 150, 300, 500, 600]}}
												value={period} size="small" onChange={handlePeriodSelectChange} title="Period Select"
												renderValue={(i: string) => periods.data.find(p => p.id === Number(i))?.name ?? "All"}>
			<MenuItem key="-1" value="-1">
				<Typography sx={{fontStyle: "italic"}}>All&nbsp;</Typography>
			</MenuItem>
			{periods.data.map((period) => {
				return <MenuItem key={period.id} value={period.id}>
					<Stack>
						{period.name}
						<br/>
						<Typography variant="overline">{period.from} - {period.to}</Typography>
					</Stack>
				</MenuItem>
			})}
		</Select>}
		{(() => {
			if (plusButton)
				return <IconButton color="secondary" onClick={() => {
					setConfirmed(false)
					setOpen(true)
				}} title="New Grade"><AddIcon/></IconButton>
			else if (oneButton)
				return <Button variant="contained" color="secondary" onClick={() => {
					setConfirmed(false)
					setOpen(true)
				}} title="New Grade">New&nbsp;Grade</Button>
			else
				return <>
					<Button color="secondary" variant="contained" onClick={() => {
						setConfirmed(false)
						setOpen(true)
					}} title="New Grade">New&nbsp;WIP&nbsp;Grade</Button>
					<Button color="secondary" variant="contained" onClick={() => {
						setConfirmed(true)
						setOpen(true)
					}} title="New Grade">New&nbsp;Confirmed&nbsp;Grade</Button>
				</>
		})()}
	</Stack>;
}