import {CircularProgress, Skeleton, Stack} from '@mui/material'

export function loadingSpinner() {
	return <Stack sx={{padding: 4}} direction="row" justifyContent="center"
					  alignItems="center"><CircularProgress variant="indeterminate"/></Stack>
}

export function loadingSkeleton(height: number) {
	return () => <Skeleton variant="rounded" height={height}/>
}