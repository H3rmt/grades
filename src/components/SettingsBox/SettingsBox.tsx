import {Paper, Stack, Typography} from "@mui/material";
import {ReactNode} from "react";

type Props = {
	children: ReactNode,
	top?: ReactNode,
	title: string
};


export default function SettingsBox(props: Props) {
	return <Paper variant="outlined" sx={{borderRadius: 4, padding: 1, borderColor: "primary.main", borderWidth: 3}}>
		<Stack direction="row" alignItems="flex-start" spacing={1} justifyContent="space-between">
			<Typography variant="h5" color="inherit"  padding={0.5}>
				{props.title}
			</Typography>
			{props.top}
		</Stack>
		{props.children}
	</Paper>
};