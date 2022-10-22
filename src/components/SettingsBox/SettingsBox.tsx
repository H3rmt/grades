import {Paper, Stack, Typography} from "@mui/material";
import {ReactNode} from "react";

type Props = {
	children: ReactNode,
	top?: ReactNode,
	title: string
};


export const SettingsBox = (props: Props) => {


	return (
			<Paper variant="outlined" sx={{borderRadius: 4, padding: 1, borderColor: "secondary.main"}}>
				<Stack direction="row" spacing={1} borderColor="aqua" alignItems="start" justifyContent="space-between">
					<Typography variant="h5" color="inherit" padding={1} paddingTop={0}>
						{props.title}
					</Typography>
					{props.top}
				</Stack>
				{props.children}
			</Paper>
	);
};