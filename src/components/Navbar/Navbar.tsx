import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar} from "@mui/material"
import {useAtom} from "jotai"
import {navBarOpen} from "../../atoms"
import {Link} from "@tanstack/react-router"
import {ReactElement, forwardRef} from "react"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import QueryStatsIcon from "@mui/icons-material/QueryStats"
import SettingsIcon from "@mui/icons-material/Settings"

export type Pages = {
	overview: Page
	analysis: Page
	settings: Page
}

export type Page = {
	name: string
	description: string
	path: string
	icon: ReactElement,
}

const pages = {
	overview: {
		name: "Overview",
		description: "Overview of all grades",
		path: '/',
		icon: <FormatListNumberedIcon/>,
	},
	analysis: {
		name: "Analysis",
		description: "Analysis of all grades",
		path: '/analysis',
		icon: <QueryStatsIcon/>
	},
	settings: {
		name: "Settings",
		description: "Change types, subjects, etc.",
		path: '/settings',
		icon: <SettingsIcon/>
	}
} satisfies Pages

export default function Navbar() {
	const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

	const [openNav, setOpenNav] = useAtom(navBarOpen)

	return <SwipeableDrawer open={openNav} anchor="left" onOpen={() => setOpenNav(true)} onClose={() => setOpenNav(false)}
									variant="temporary" disableBackdropTransition={false} disableDiscovery={iOS} swipeAreaWidth={15}>
		<Toolbar/>
		<List disablePadding sx={{height: 1}}>
			{Object.entries(pages).filter(([key]) => key != "settings").map(([key, page]) => (
					<ListItem key={key} disablePadding>
						<ListItemButton component={RLink} to={page.path}>
							<ListItemIcon>
								{page.icon}
							</ListItemIcon>
							<ListItemText primary={page.name} secondary={page.description}
											  sx={{textDecoration: page.name == "TODO current page" ? "underline" : ""}}/>
						</ListItemButton>
					</ListItem>
			))}
		</List>
		<Divider/>
		<ListItem key="Settings" disablePadding>
			<ListItemButton component={RLink} to={pages.settings.path}>
				<ListItemIcon>
					{pages.settings.icon}
				</ListItemIcon>
				<ListItemText primary={pages.settings.name} secondary={pages.settings.description}
								  sx={{textDecoration: pages.settings.name == "TODO current page" ? "underline" : ""}}/>
				{/* TODO highlight open path */}
			</ListItemButton>
		</ListItem>
	</SwipeableDrawer>
}

export const RLink = forwardRef<HTMLAnchorElement, any>(function RLink(
		itemProps,
		ref,
) {
	return <Link role={undefined} ref={ref} {...itemProps} />
})