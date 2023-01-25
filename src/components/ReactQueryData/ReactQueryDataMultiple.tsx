import {UseQueryResult} from "@tanstack/react-query";
import {Paper, Stack, Typography} from "@mui/material";
import {loadingSkeleton} from "./loadings";

type Result<T> = { query: UseQueryResult<T, Error | string>, data: T | undefined }

type Props<T extends unknown[]> = {
	queries: readonly [...Queries<T>]
	loading?: () => JSX.Element;
	loadingHeight?: number;
	error?: (err: Error | string) => JSX.Element;
	display: (data: [...Returns<T>]) => JSX.Element | JSX.Element[];
}

type Returns<
		T extends unknown[],
		Res extends unknown[] = [],
		Depth extends ReadonlyArray<number> = [],
> = T extends [infer Head]
		? [...Res, NonNullable<Head>]
		: T extends [infer Head, ...infer Tail]
				? Returns<[...Tail], [...Res, NonNullable<Head>], [...Depth, 1]>
				: T


type Queries<
		T extends unknown[],
		Res extends unknown[] = [],
		Depth extends ReadonlyArray<number> = [],
> = T extends [infer Head]
		? [...Res, Result<Head>]
		: T extends [infer Head, ...infer Tail]
				? Queries<[...Tail], [...Res, Result<Head>], [...Depth, 1]>
				: Result<unknown>[]


export default function ReactQueryDataMultiple<T extends unknown[]>(props: Props<T>) {
	let ret: [...Returns<T>] = [] as unknown as [...Returns<T>]
	let errors = []
	let loading = false

	for (const [i, q] of props.queries.entries()) {
		const [query, data] = [q.query, q.data]
		if (query.isLoading || data === undefined)
			loading = true


		if (query.isError) {
			errors.push(props.error ? props.error(query.error) :
					<Paper variant="outlined" sx={{borderWidth: 2, padding: 0.5, borderColor: "error.main"}}>
						<Typography color="error.main" variant="subtitle2">
							Error: {query.error.toString()}
						</Typography>
					</Paper>)
		}

		ret[i] = data
	}

	if (errors.length > 0)
		return <Stack spacing={1}>{errors}</Stack>

	if (loading)
		return props.loading ? props.loading() : loadingSkeleton(props.loadingHeight ?? 0)();

	return <>{props.display(ret)}</>
}
