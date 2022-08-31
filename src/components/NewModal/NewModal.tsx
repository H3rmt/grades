import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";

function NewModal(props: { open: boolean, closeModal: () => void }) {
	return (<Dialog open={props.open} onClose={props.closeModal}>
		<DialogTitle>Subscribe</DialogTitle>
		<DialogContent>
			<DialogContentText>
				To subscribe to this website, please enter your email address here. We
				will send updates occasionally.
			</DialogContentText>
			<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Email Address"
					type="email"
					fullWidth
					variant="standard"
			/>
		</DialogContent>
		<DialogActions>
			<Button onClick={props.closeModal}>Cancel</Button>
			<Button onClick={props.closeModal}>Subscribe</Button>
		</DialogActions>
	</Dialog>);
}

export default NewModal;