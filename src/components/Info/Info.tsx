import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type Props = {
	info: string
	open: boolean
	setOpen: (open: boolean) => void
};


export function Info(props: Props) {
	return <Dialog open={props.open}>
		<DialogTitle>Info</DialogTitle>
		<DialogContent>
			<DialogContentText>
				{props.info}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button color="secondary" variant="outlined" onClick={() => props.setOpen(false)}>
				Close
			</Button>
		</DialogActions>
	</Dialog>;
}