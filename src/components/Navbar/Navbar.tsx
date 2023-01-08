import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar} from "@mui/material";
import {Page, Pages} from "../../App";
import {reactSet} from "../../ts/utils";

export default function Navbar(props: { open: boolean, set: reactSet<boolean>, setPage: (page: Page) => void, pages: Pages, openPageName: string }) {
	const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	return <SwipeableDrawer open={props.open} anchor="left" onOpen={() => props.set(true)} onClose={() => props.set(false)}
									variant="temporary" disableBackdropTransition={false} disableDiscovery={iOS} swipeAreaWidth={15}>
		<Toolbar/>
		<List disablePadding sx={{height: 1}}>
			{Object.entries(props.pages).filter(([key]) => key != "settings").map(([key, page]) => (
					<ListItem key={key} disablePadding>
						<ListItemButton onClick={() => {
							props.setPage(page)
						}}>
							<ListItemIcon>
								{page.icon}
							</ListItemIcon>
							<ListItemText primary={page.name} secondary={page.description}
											  sx={{textDecoration: page.name == props.openPageName ? "underline" : ""}}/>
						</ListItemButton>
					</ListItem>
			))}
		</List>
		<Divider/>
		<ListItem key="Settings" disablePadding>
			<ListItemButton onClick={() => {
				props.setPage(props.pages.settings)
			}}>
				<ListItemIcon>
					{props.pages.settings.icon}
				</ListItemIcon>
				<ListItemText primary={props.pages.settings.name} secondary={props.pages.settings.description}
								  sx={{textDecoration: "Settings" == props.openPageName ? "underline" : ""}}/>
			</ListItemButton>
		</ListItem>
	</SwipeableDrawer>
};
