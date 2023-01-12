import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings"
import {ForwardRefExoticComponent, PropsWithoutRef, ReactElement, RefAttributes, useRef, useState} from "react";
import Overview from "./Overview/Overview";
import Analysis from "./Analysis/Analysis";
import Settings from "./Settings/Settings";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MenuIcon from "@mui/icons-material/Menu";
import {useAtom} from "jotai";
import {navBarOpen} from "./atoms";
import {Info} from "./components/Info/Info";
import {useEditPageInCache, usePageInCache} from "./commands/cache";
import {useQueryClient} from "@tanstack/react-query";
import OverviewAppBar from "./Overview/OverviewAppBar";
import Navbar from "./components/Navbar/Navbar";

export type Pages = {
	overview: Page
	analysis: Page
	settings: Page
}

export type Page = {
	page: ForwardRefExoticComponent<PropsWithoutRef<PageProps> & RefAttributes<PageRef>>
	appBar: ReactElement
	name: string
	description: string
	icon: ReactElement,
}

export type PageProps = {}
export type PageRef = { changed: () => [boolean, string] }

const pages: Pages = {
	overview: {
		page: Overview,
		appBar: <OverviewAppBar/>,
		name: "Overview",
		description: "Overview of all grades",
		icon: <FormatListNumberedIcon/>,
	},
	analysis: {
		page: Analysis,
		appBar: <></>,
		name: "Analysis",
		description: "Analysis of all grades",
		icon: <QueryStatsIcon/>
	},
	settings: {
		page: Settings,
		appBar: <></>,
		name: "Settings",
		description: "Change types, subjects, etc.",
		icon: <SettingsIcon/>
	}
}

export default function App() {
	const [openPage, setPage] = useState(pages.overview)
	const [openNav, setOpenNav] = useAtom(navBarOpen);

	const childRef = useRef<PageRef>(null);

	const [unsaved, setUnsaved] = useState(false);
	const [unsavedMessage, setUnsavedMessage] = useState("");
	const [unsavedNextPage, setUnsavedNextPage] = useState<Page>(openPage)

	const queryClient = useQueryClient()

	usePageInCache({
		onError: (error) => {
			console.warn("Error loading site cache", error)
			// errorToast("Error loading Periods", toast, error)
		},
		onSuccess: (page) => {
			// @ts-ignore
			console.log(pages[page.name.toLowerCase()])
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

	const openNewPage = (page: Page) => {
		const [changed, message] = childRef?.current?.changed() ?? [false, ""]
		if (changed) {
			setUnsaved(true)
			setUnsavedMessage(message)
			setUnsavedNextPage(page)
		} else {
			setUnsaved(false)
			editPage.mutate({name: page.name})
			// @ts-ignore
			if (pages[page.name.toLowerCase()]) {
				// @ts-ignore
				setPage(pages[page.name.toLowerCase()])
			}
		}
		setOpenNav(false)
	}

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
		<Navbar setPage={openNewPage} pages={pages} openPageName={openPage.name}/>
		<Box component="main">
			<Toolbar/>
			{<openPage.page ref={childRef}/>}
		</Box>
		<Info info={unsavedMessage} open={unsaved} setOpen={() => setUnsaved(false)}>
			<Button color="secondary" variant="outlined" onClick={() => {
				setPage(unsavedNextPage)
				setUnsaved(false)
			}}>
				Discard Changes
			</Button>
		</Info>
	</>)
}