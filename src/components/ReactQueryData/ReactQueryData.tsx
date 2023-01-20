import {UseQueryResult} from "@tanstack/react-query";
import React from "react";
import {Typography} from "@mui/material";

type Props<T> = {
	query: UseQueryResult<T, string | Error>;

	loading?: () => JSX.Element;
	error?: (err: Error | string) => JSX.Element;
	display: (t: T) => JSX.Element;

}

export default function ReactQueryData<T>(props: Props<T>) {
	const {data, isError, error, isLoading} = props.query;

	if (isLoading) {
		return (props?.loading ?? (() => <Typography>Loading...</Typography>))()
	}

	if (isError) {
		return (props?.error ?? ((err: Error | string) => <Typography color="error">{err.toString()}</Typography>))(error)
	}

	return props.display(data);
}
