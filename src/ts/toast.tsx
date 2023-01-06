import {OptionsObject, SnackbarKey, SnackbarMessage} from "notistack";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Stack} from "@mui/material";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';

type variant = "error" | "success" | "warning" | "info"

export function errorToast(
		message: string,
		toast: toast,
		error: string | Error,
		opts?: OptionsObject
): () => void {
	return toastMessage("error", message, toast, undefined, error.toString(), opts)
}

export function toastMessage(
		variant: variant,
		message: string,
		toast: toast,
		undo?: (id: SnackbarKey) => void,
		info?: string,
		opts?: OptionsObject
): () => void {
	let key = toast.enqueueSnackbar(message,
			Object.assign({
						variant: variant,
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'right'
						},
						action: action(variant, toast.closeSnackbar, undo, info),
						persist: variant == "error",
						autoHideDuration: variant == "warning" ? 3500 : 1500
					}, opts
			)
	)
	return () => toast.closeSnackbar(key)
}

export type toast = {
	enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey
	closeSnackbar: (key?: SnackbarKey) => void
}

function action(
		variant: variant,
		close: (id: SnackbarKey) => void,
		undo?: (id: SnackbarKey) => void,
		info?: string,
): (id: SnackbarKey) => JSX.Element {
	return (id: SnackbarKey) => {
		let [open, setOpen] = useState(false)

		return <Stack direction="row" spacing={1.5}>
			{undo && <Paper variant="outlined">
				<Button color="secondary" onClick={() => {
					undo(id)
				}}>Undo
				</Button>
			</Paper>}
			{info && <Paper variant="outlined">
				<Button color="secondary" onClick={() => {
					setOpen(true)
				}}>Info
				</Button>
			</Paper>}
			<IconButton color="primary" onClick={() => {
				close(id)
			}}><CloseIcon/>
			</IconButton>
			{open && <Dialog open={true}>
				<DialogTitle>Info</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{info}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="secondary" variant="outlined" onClick={() => setOpen(false)}>
						Close
					</Button>
				</DialogActions>
			</Dialog>}
		</Stack>
	}
}