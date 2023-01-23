import {createRouteConfig, Outlet} from "@tanstack/react-router";
import {Box, Toolbar} from "@mui/material";
import Navbar from "../components/Navbar/Navbar";

export const rootRoute = createRouteConfig({
	component: () => <>
		<Navbar/>
		<Toolbar/>
		<Box component="main">
			<Outlet/>
		</Box>
		{/*<TanStackRouterDevtools position="bottom-right"/>*/}
	</>
})