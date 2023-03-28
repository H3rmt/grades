import { RootRoute, Outlet } from '@tanstack/react-router'
import { Box, Toolbar } from '@mui/material'
import Navbar from '../components/Navbar/Navbar'

export const rootRoute = new RootRoute({
	component: () => <>
		<Navbar />
		<Toolbar />
		<Box component="main">
			<Outlet />
		</Box>
	</>,
})