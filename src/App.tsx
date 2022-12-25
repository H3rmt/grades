import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings"
import React, {ReactElement, useEffect, useState} from "react";
import Overview from "./Overview/Overview";
import Analysis from "./Analysis/Analysis";
import Navbar from "./components/Navbar/Navbar";
import Settings from "./Settings/Settings";
import {Page as SPage} from "./entity"
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {edit, get} from "./ts/utils";
import {OverviewAppBar} from "./Overview/AppBar";
import MenuIcon from "@mui/icons-material/Menu";

type Pages = {
	overview: Page
	analysis: Page
	settings: Page
}

type Page = {
	page: ReactElement,
	appBar: ReactElement,
	name: string,
	description: string,
	icon: ReactElement
}

const pages: Pages = {
	overview: {
		page: <Overview/>,
		appBar: <OverviewAppBar/>,
		name: "Overview",
		description: "Overview of all grades",
		icon: <FormatListNumberedIcon/>,
	},
	analysis: {
		page: <Analysis/>,
		appBar: <></>,
		name: "Analysis",
		description: "Analysis of all grades",
		icon: <QueryStatsIcon/>
	},
	settings: {
		page: <Settings/>,
		appBar: <></>,
		name: "Settings",
		description: "Change types, subjects, etc.",
		icon: <SettingsIcon/>
	}
}

const App = () => {
	const [openNav, setOpenNav] = useState(false);

	const [openPage, setPage] = useState(pages.overview)
	useEffect(() => {
		setOpenNav(false)
	}, [openPage])

	// cache has special logging, no errorToast and console.error
	const SetPage = (page: Page) => {
		edit("page_in_cache", {"name": page.name}).then(() => {
			console.debug("Stored page in cache")
		}).catch((error) => {
			console.warn("Error storing page in cache", error)
			// errorToast("Error storing page in cache", toast, error)
		})
		setPage(page)
	}

	const GetPage = () => {
		get<SPage>("page_from_cache").then((data: SPage) => {
			console.log("loaded site from cache", data)
			// @ts-ignore
			if (pages[data.name.toLowerCase()]) {
				// @ts-ignore
				setPage(pages[data.name.toLowerCase()])
			}
		}).catch((error) => {
			console.warn("Error loading site cache", error)
		})
	}

	useEffect(() => {
		GetPage()
	}, [])

	return (<>
		<AppBar component="nav" enableColorOnDark position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
			<Toolbar>
				<IconButton color="inherit" aria-label="open drawer" edge="start" size="medium" onClick={() => {
					setOpenNav(!openNav)
				}}><MenuIcon/>
				</IconButton>
				<Typography variant="h5" noWrap align="left" padding="6px" flexGrow="1">
					{openPage.name}
				</Typography>
				{openPage.appBar}
			</Toolbar>
		</AppBar>
		<Navbar open={openNav} set={setOpenNav} setPage={SetPage} pages={pages} openPageName={openPage.name}/>
		<Box component="main">
			<Toolbar />
			{openPage.page}
		</Box>
	</>)
}

export default App

export type {
	Page,
	Pages
}