import {AppBar, IconButton, Toolbar, Typography} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import {navBarOpen} from "../../atoms"
import {ReactNode} from "react"

type Props = {
	name: string,
	children?: ReactNode,
}

export default function Topbar(props: Props) {
	const openNav = navBarOpen((state) => state.open)
	const setOpenNav = navBarOpen((state) => state.set)

	return <AppBar component="nav" position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
		<Toolbar>
			<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => {
				setOpenNav(!openNav)
			}}><MenuIcon/>
			</IconButton>
			<Typography variant="h5" noWrap align="left" padding="6px" flexGrow="1">
				{props.name}
			</Typography>
			{props.children ?? <></>}
		</Toolbar>
	</AppBar>
}
