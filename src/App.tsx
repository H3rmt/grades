import './App.css'
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useState} from "react";
import Navbar from "./components/navbar/navbar";

const App = () => {
	const [open, setOpen] = useState(false);

	let toggle = () => {
		setOpen(!open)
	}

	return (<div>
		<AppBar position="fixed">
			<Toolbar>
				<IconButton color="inherit" aria-label="open drawer" edge="start">
					<MenuIcon onClick={() => {
						setOpen(!open)
					}}/>
				</IconButton>
				<Typography variant="h5" noWrap component="div" align="center">
					Responsive drawer
				</Typography>
			</Toolbar>
		</AppBar>
		<Navbar open={open} toggle={toggle}/>
	</div>)
}

export default App
