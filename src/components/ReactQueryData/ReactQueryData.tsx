import {UseQueryResult} from "@tanstack/react-query";
import {Paper, Typography} from "@mui/material";
import {loadingSkeleton} from "./loadings";

type Props<T> = {
	query: UseQueryResult<T, string | Error>;
	data: T;
	loading?: () => JSX.Element;
	loadingHeight?: number;
	error?: (err: Error | string) => JSX.Element;
	display: (data: NonNullable<T>) => JSX.Element | JSX.Element[];
}

export default function ReactQueryData<T>(props: Props<T>) {
	if (props.query.isLoading) {
		return props.loading ? props.loading() : loadingSkeleton(props.loadingHeight ?? 0)();
	}

	if (props.query.isError) {
		return props.error ? props.error(props.query.error) :
				<Paper variant="outlined" sx={{borderWidth: 2, padding: 0.5, borderColor: "error.main"}}>
					<Typography color="error.main" variant="subtitle2">
						Error: {props.query.error.toString()}
					</Typography>
				</Paper>
	}

	if (props.data === undefined) {
		return props.loading ? props.loading() : loadingSkeleton(props.loadingHeight ?? 0)();
	}

	return <>{props.display(props.data as NonNullable<T>)}</>;
}
