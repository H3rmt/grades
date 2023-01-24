import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useState} from "react";
import {useAtom} from "jotai";
import {navBarOpen} from "../../atoms";
import {useMatch} from "@tanstack/react-router";

type Props = {
	name: string,
	children?: React.ReactNode,
}

export default function Topbar(props: Props) {
	const [openNav, setOpenNav] = useAtom(navBarOpen);

	const [prevMatch, setPrevMatch] = useState("")

	// the weirdest way to close nav on route change
	const matchRoute = useMatch()
	if (prevMatch != matchRoute.id) {
		setPrevMatch(matchRoute.id)
		setOpenNav(false)
	}

	return <AppBar component="nav" position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
		<Toolbar>
			<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => {
				setOpenNav(!openNav)
			}}><MenuIcon/>
			</IconButton>
			<Typography variant="h5" noWrap align="left" padding="6px" flexGrow="1">
				{props.name}
			</Typography>
			{props.children ?? <></>}
		</Toolbar>
	</AppBar>
}