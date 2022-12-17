import {Box} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings"
import {ReactElement, useEffect, useState} from "react";
import Overview from "./Overview/Overview";
import Analysis from "./Analysis/Analysis";
import Navbar from "./components/Navbar/Navbar";
import Settings from "./Settings/Settings";
import {invoke} from "@tauri-apps/api/tauri";
import {errorToast, useToast} from "./ts/toast";
import {Page as SPage} from "./entity"
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

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

	const toast = useToast()

	const pages: Pages = {
		overview: {
			page: <Overview setOpenNav={setOpenNav}/>,
			name: "Overview",
			description: "Overview of all grades",
			icon: <FormatListNumberedIcon/>,
		},
		analysis: {
			page: <Analysis setOpenNav={setOpenNav}/>,
			name: "Analysis",
			description: "Analysis of all grades",
			icon: <QueryStatsIcon/>
		},
		settings: {
			page: <Settings setOpenNav={setOpenNav}/>,
			name: "Settings",
			description: "Change types, subjects, etc.",
			icon: <SettingsIcon/>
		}
	}

	const [openPage, setPage] = useState(pages.overview)
	useEffect(() => {
		setOpenNav(false)
	}, [openPage])

	const SetPage = (page: Page) => {
		invoke("save_page_in_cache_js", {
			json: JSON.stringify({"name": page.name})
		}).then(() => {
			console.log("Stored page in cache")
		}).catch((error) => {
			console.error("Error storing page in cache", error)
			errorToast("Error storing page in cache", toast, error)
		})
		setPage(page)
	}

	const GetPage = () => {
		// @ts-ignore
		invoke("get_page_from_cache_js").then((data: string) => {
			console.log("loaded site from cache", data)
			let page: SPage = JSON.parse(data)
			// @ts-ignore
			setPage(pages[page.name.toLowerCase()])
		}).catch((error) => {
			console.error("Error loading site cache", error)
		})
	}

	useEffect(() => {
		GetPage()
	}, [])

	return (<>
		<Navbar open={openNav} closeNav={() => {
			setOpenNav(false)
		}} setPage={SetPage} pages={pages}/>
		<Box component="main">
			{openPage.page}
		</Box>
	</>)
}

export default App

export type {
	Page,
	Pages
}