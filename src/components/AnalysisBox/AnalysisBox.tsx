import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
import {Fab, Menu, MenuItem, Paper, Typography} from "@mui/material"
import {ReactNode, useRef, useState} from "react"

type Props = {
	children: ReactNode,
	top?: ReactNode[],
	title?: string
}


export function AnalysisBox(props: Props) {
	const anchor = useRef<HTMLButtonElement>(null)
	const [open, setOpen] = useState(false)

	return <Paper variant="outlined"
					  sx={{borderRadius: 4, padding: 1, borderColor: "primary.main", borderWidth: 3, position: 'relative', minHeight: 70}}>
		{(() => {
			if (props.title && props.top) {
				return <>
					<Typography variant="h5" color="inherit" padding={1} paddingTop={0.4}>
						{props.title}
					</Typography>
					<Fab size="small" color="primary" sx={{position: 'absolute', top: 12, right: 12}} ref={anchor}
						  onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
					</Fab>
					<Menu anchorEl={anchor.current} open={open} onClose={() => setOpen(false)} sx={{marginTop: 1}}>
						{props.top}
						{/*{props.top.map((item: ReactNode, index: number) =>
								<MenuItem onClick={() => setOpen(false)} key={index}>{item}</MenuItem>)
						}*/}
					</Menu>
				</>
			} else if (props.title) {
				return <Typography variant="h5" color="inherit" padding={1} paddingTop={0.4}>
					{props.title}
				</Typography>
			} else if (props.top) {
				return <>
					<Fab size="small" color="primary" sx={{position: 'absolute', top: 12, right: 12}} ref={anchor}
						  onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
					</Fab>
					<Menu anchorEl={anchor.current} open={open} onClose={() => setOpen(false)} sx={{marginTop: 1}}>
						{props.top.map((item: ReactNode, index: number) =>
								<MenuItem onClick={() => setOpen(false)} key={index}>{item}</MenuItem>)
						}
					</Menu>
				</>
			} else {
				return <></>
			}
		})()}
		{props.children}
	</Paper>
}
