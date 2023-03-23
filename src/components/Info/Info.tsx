import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"
import {ReactNode} from "react"

type Props = {
	info: string
	title?: string
	open: boolean
	setOpen: (open: boolean) => void
	closeText?: string
	children?: ReactNode
};

export function Info(props: Props) {
	return <Dialog open={props.open}>
		<DialogTitle>{props?.title ?? "Info"}</DialogTitle>
		<DialogContent>
			<DialogContentText sx={{whiteSpace: 'pre-wrap'}}>
				{props.info}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button variant="contained" onClick={() => props.setOpen(false)}>
				{props.closeText ?? "Close"}
			</Button>
			{props.children}
		</DialogActions>
	</Dialog>
}