import {Fab, Menu, MenuItem, Paper, Typography} from "@mui/material";
import {ReactNode, useRef, useState} from "react";
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';

type Props = {
	children: ReactNode,
	top?: ReactNode[],
	title?: string
}


export function AnalysisBox(props: Props) {
	const anchor = useRef<HTMLButtonElement>(null)
	const [open, setOpen] = useState(false)

	return <Paper variant="outlined" sx={{borderRadius: 4, padding: 1, borderColor: "secondary.main", position: 'relative', minHeight: 65}}>
		{(() => {
			if (props.title && props.top) {
				return <>
					<Typography variant="h5" color="inherit" padding={1} paddingTop={0.4}>
						{props.title}
					</Typography>
					<Fab size="small" color="secondary" sx={{position: 'absolute', top: 10, right: 10}} ref={anchor}
						  onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
					</Fab>
					<Menu anchorEl={anchor.current} open={open} onClose={() => setOpen(false)} sx={{marginTop: 1}}>
						{props.top.map((item: ReactNode, index: number) =>
								<MenuItem onClick={() => setOpen(false)} key={index}>{item}</MenuItem>)
						}
					</Menu>
				</>
			} else if (props.title) {
				return <Typography variant="h5" color="inherit" padding={1} paddingTop={0.4}>
					{props.title}
				</Typography>
			} else if (props.top) {
				return <>
					<Fab size="small" color="secondary" sx={{position: 'absolute', top: 10, right: 10}} ref={anchor}
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
