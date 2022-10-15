import {Box} from "@mui/material";
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
	const [openModal, setOpenModal] = useState(false);


	const pages: Pages = {
		overview: {
			page: <Overview setOpenNav={setOpenNav} setOpenModal={setOpenModal}/>,
			name: "Overview",
			description: "Overview of all grades",
			icon: <MenuIcon/>,
		},
		analysis: {
			page: <Analysis setOpenNav={setOpenNav} setOpenModal={setOpenModal}/>,
			name: "Analysis",
			description: "Analysis of all grades",
			icon: <MailIcon/>
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

	return (<>
		<Navbar open={openNav} closeNav={() => {
			setOpenNav(false)
		}} setPage={setPage} pages={pages}/>
		<Box component="main">
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