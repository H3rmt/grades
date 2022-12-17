import {Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Page, Pages} from "../../App";

const Navbar = (props: { open: boolean, closeNav: () => void, setPage: (page: Page) => void, pages: Pages }) => {
	return (<Drawer anchor="left" open={props.open} onClose={props.closeNav} variant="temporary">
		<List disablePadding sx={{height: 1}}>
			{Object.entries(props.pages).filter(([key]) => key != "settings").map(([key, page]) => (
					<ListItem key={key} disablePadding>
						<ListItemButton onClick={() => {
							props.setPage(page)
						}}>
							<ListItemIcon>
								{page.icon}
							</ListItemIcon>
							<ListItemText primary={page.name} secondary={page.description}/>
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
				<ListItemText primary={props.pages.settings.name} secondary={props.pages.settings.description}/>
			</ListItemButton>
		</ListItem>
	</Drawer>);
};

export default Navbar;