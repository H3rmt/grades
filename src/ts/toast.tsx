import {OptionsObject, SnackbarKey, SnackbarMessage} from "notistack"
import {Button, IconButton, Stack} from "@mui/material"
import {useState} from "react"
import CloseIcon from '@mui/icons-material/Close'
import {Info} from "../components/Info/Info"

type variant = "error" | "success" | "warning" | "info"

export function errorToast(
		message: string,
		toast: Toast,
		error: string | Error,
		opts?: OptionsObject
): () => void {
	return toastMessage("error", message, toast, undefined, error.toString(), opts)
}

export function toastMessage(
		variant: variant,
		message: string,
		toast: Toast,
		undo?: (id: SnackbarKey) => void,
		info?: string,
		opts?: OptionsObject
): () => void {
	console.debug("toastMessage", variant, message, undo)

	const key = toast.enqueueSnackbar(message,
			Object.assign({
						variant: variant,
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'right'
						},
						action: action(variant, toast.closeSnackbar, undo, info),
						persist: variant == "error",
						autoHideDuration: variant == "warning" ? 4500 : (variant == "info" ? 4000 : 2500)
					}, opts
			)
	)
	return () => toast.closeSnackbar(key)
}

export type Toast = {
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
		const [open, setOpen] = useState(false)

		return <Stack direction="row" spacing={1.5}>
			{undo && <Button variant="outlined" onClick={() => {
				undo(id)
			}}>Undo
			</Button>}
			{info && <Button variant="outlined" onClick={() => {
				setOpen(true)
			}}>Info
			</Button>}
			<IconButton onClick={() => {
				close(id)
			}}><CloseIcon/>
			</IconButton>
			{info && <Info open={open} info={info} setOpen={setOpen}/>}
		</Stack>
	}
}