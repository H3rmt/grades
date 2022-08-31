import React from 'react';
import {Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Page, Pages} from "../../App";

const Navbar = (props: { open: boolean, closeNav: () => void, setPage: (page: Page) => void, pages: Pages }) => {
	return (<Drawer anchor="left" open={props.open} onClose={props.closeNav} variant="temporary">
		<List>
			{Object.entries(props.pages).map(([key, page]) => (
					<>
						<ListItem key={key} disablePadding>
							<ListItemButton onClick={() => {
								props.setPage(page)
							}}>
								<ListItemIcon>
									{page.icon}
								</ListItemIcon>
								<ListItemText primary={page.name}/>
							</ListItemButton>
						</ListItem>
						<Divider/>
					</>
			))}
		</List>
	</Drawer>);
};

export default Navbar;