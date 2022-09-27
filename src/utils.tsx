import {OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar} from "notistack";
import {Button, Paper} from "@mui/material";
import React from "react";

type variant = "error" | "success" | "warning" | "info"

const toastMessage: (
		variant: variant,
		message: string,
		toast: toast,
		undo?: (id: SnackbarKey) => void,
		opts?: OptionsObject,
) => SnackbarKey = (
		variant: variant,
		message: string,
		toast: toast,
		undo?: (id: SnackbarKey) => void,
		opts?: OptionsObject
) => {
	return toast.openToast(message,
			Object.assign({
						variant: variant,
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'right'
						},
						action: action(variant, toast.closeToast, undo)
					}, opts
			)
	)
}

type toast = {
	openToast: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey
	closeToast: (key?: SnackbarKey) => void
}

const useToast: () => toast = () => {
	let {enqueueSnackbar, closeSnackbar} = useSnackbar()
	return {openToast: enqueueSnackbar, closeToast: closeSnackbar}
}

const action: (
		variant: variant,
		close: (id: SnackbarKey) => void,
		undo?: (id: SnackbarKey) => void
) => (id: SnackbarKey) => JSX.Element = (
		variant: variant,
		close: (id: SnackbarKey) => void,
		undo?: (id: SnackbarKey) => void
) => {
	return (id: SnackbarKey) =>
			<div style={{gap: 8, display: "flex"}}>
				{undo && <Paper elevation={1} variant="outlined">
					<Button variant="text" color="secondary" onClick={() => {
						undo(id)
					}}>Undo
					</Button>
				</Paper>}
				<Paper elevation={1} variant="outlined">
					<Button variant="text" color="secondary" onClick={() => {
						close(id)
					}}>Dismiss
					</Button>
				</Paper>
			</div>
};

export {
	toastMessage,
	useToast
}

export type {
	toast
}