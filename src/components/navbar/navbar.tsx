import React from 'react';
import {CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const Navbar = (props: { open: boolean, toggle: () => void }) => {
	return (<div>
		<CssBaseline/>
		<Drawer anchor="left" open={props.open} onClose={props.toggle} variant="temporary">
			<List>
				{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
								</ListItemIcon>
								<ListItemText primary={text}/>
							</ListItemButton>
						</ListItem>
				))}
			</List>
			<Divider/>
		</Drawer>
	</div>);
};

export default Navbar;