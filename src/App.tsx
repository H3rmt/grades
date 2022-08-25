import './App.css'
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {Component, createRef, MutableRefObject} from "react";
import Navbar from "./components/navbar/navbar";

class App extends Component {
	private readonly navbar: MutableRefObject<Navbar>;

	constructor(props: {}) {
		super(props);
		// @ts-ignore
		this.navbar = createRef<Navbar>()
	}

	render() {
		return (<div>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" edge="start">
						<MenuIcon onClick={() => {
							this.navbar.current.toggle()
						}}/>
					</IconButton>
					<Typography variant="h5" noWrap component="div" align="center">
						Responsive drawer
					</Typography>
				</Toolbar>
			</AppBar>
			<Navbar ref={this.navbar}/>
		</div>)
	}
}

export default App
