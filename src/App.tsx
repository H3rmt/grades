import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail"
import SettingsIcon from "@mui/icons-material/Settings"
import React, {ReactElement, useEffect, useState} from "react";
import Overview from "./Overview/Overview";
import Analysis from "./Analysis/Analysis";
import Navbar from "./components/Navbar/Navbar";
import NewGradeModal from "./components/NewGradeModal/NewGradeModal";
import Settings from "./Settings/Settings";

type Pages = {
	overview: Page
	analysis: Page
	settings: Page
}

type Page = {
	page: ReactElement,
	name: string,
	description: string,
	icon: ReactElement
}

const App = () => {
	const [openNav, setOpenNav] = useState(false);

	const pages: Pages = {
		overview: {
			page: <Overview/>,
			name: "Overview",
			description: "Overview of all grades",
			icon: <MenuIcon/>
		},
		analysis: {
			page: <Analysis/>,
			name: "Analysis",
			description: "Analysis of all grades",
			icon: <MailIcon/>
		},
		settings: {
			page: <Settings/>,
			name: "Settings",
			description: "Change types, subjects, etc.",
			icon: <SettingsIcon/>
		}
	}
	const [openPage, setPage] = useState(pages.overview)
	useEffect(() => {
		setOpenNav(false)
	}, [openPage])

	const [openModal, setOpenModal] = useState(false);

	return (<>
		<AppBar component="nav" enableColorOnDark position="fixed">
			<Toolbar variant="regular">
				<IconButton color="inherit" aria-label="open drawer" edge="start" size="large" onClick={() => {
					setOpenNav(true)
				}}><MenuIcon/>
				</IconButton>
				<Typography variant="h5" noWrap component="div" align="left" padding="6px" flexGrow="1">
					{openPage.name}
				</Typography>
				<Button color="secondary" variant="contained" onClick={() => {
					setOpenModal(true)
				}}>New Grade</Button>
			</Toolbar>
		</AppBar>
		<Navbar open={openNav} closeNav={() => {
			setOpenNav(false)
		}} setPage={setPage} pages={pages}/>
		<Box component="main">
			<Toolbar/>
			{openPage.page}
		</Box>
		<NewGradeModal open={openModal} closeModal={() => {
			setOpenModal(false)
		}}/>
	</>)
}

export default App

export type {
	Page,
	Pages
}