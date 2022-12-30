import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings"
import React, {ReactElement, useEffect, useState} from "react";
import Overview from "./Overview/Overview";
import Analysis from "./Analysis/Analysis";
import Navbar from "./components/Navbar/Navbar";
import Settings from "./Settings/Settings";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {OverviewAppBar} from "./Overview/OverviewAppBar";
import MenuIcon from "@mui/icons-material/Menu";
import {useEditPageInCache, usePageInCache} from "./commands/cache";
import {useQueryClient} from "@tanstack/react-query";

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

	const queryClient = useQueryClient()

	const page = usePageInCache({
		onError: (error) => {
			console.warn("Error loading site cache", error)
			// errorToast("Error loading Periods", toast, error)
		},
		onSuccess: (page) => {
			// @ts-ignore
			if (pages[page.name.toLowerCase()]) {
				// @ts-ignore
				setPage(pages[page.name.toLowerCase()])
			}
		}
	});

	const editPage = useEditPageInCache(queryClient, {
		onError: (error) => {
			console.warn("Error loading site cache", error)
		}
	});

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
		<Navbar open={openNav} set={setOpenNav} setPage={setPage} pages={pages} openPageName={openPage.name}/>
		<Box component="main">
			<Toolbar/>
			{openPage.page}
		</Box>
	</>)
}

export default App

export type {
	Page,
	Pages
}