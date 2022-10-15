import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import * as React from "react";
import {ReactElement} from "react";
import {reactSet} from "./utils";

type Props = {
	setOpenNav: reactSet<boolean>
	name: string
	other: ReactElement
}

export default function CAppBar(props: Props) {
	return <>
		<AppBar component="nav" enableColorOnDark position="fixed">
			<Toolbar variant="regular">
				<IconButton color="inherit" aria-label="open drawer" edge="start" size="large" onClick={() => {
					props.setOpenNav(true)
				}}><MenuIcon/>
				</IconButton>
				<Typography variant="h5" noWrap component="div" align="left" padding="6px" flexGrow="1">
					{props.name}
				</Typography>
				{props.other}
			</Toolbar>
		</AppBar>
		<Toolbar/>
	</>
}