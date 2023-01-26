import {Key, ReactNode, useCallback, useState} from "react"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import {getComparator, Order, setSort} from "./sort"
import {Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, Table, TableSortLabel, Typography} from "@mui/material"
import {capitalizeFirstLetter} from "../../ts/utils"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveButton from '@mui/icons-material/Save'
import {Cols, Column, ColumnDef, IRow} from "./defs"
import HandymanIcon from '@mui/icons-material/Handyman'
import CloseIcon from "@mui/icons-material/Close"

type Props<Row extends IRow> = {
	data: Array<Row>
	cols: Cols<Row>
	delete?: (id: number) => void
	edit?: (row: Row) => void
	title?: string // used for testing if rendered
}

export function CTable<Row extends IRow>(props: Props<Row>) {
	const [order, setOrder] = useState<Order>('asc')
	const [orderBy, setOrderBy] = useState<keyof Row>('id')

	const [, updateState] = useState<object>()
	const forceUpdate = useCallback(() => updateState({}), [])

	const [data, setData] = useState<Map<number, Column<Row>>>(new Map())

	let change = false

	// remove deleted rows
	for (const col of data.values()) {
		if (props.data.find(row => row.id === col.data.id) === undefined) {
			data.delete(col.data.id)
			change = true
		}
	}

	for (const col of props.data) {
		const co = data.get(col.id)
		// update existing rows
		if (co) {
			co.data = col
		} else {
			// add new rows
			data.set(col.id, {data: col, dialogOpen: false, edit: false, temp: {...col}})
			change = true
		}
	}

	// check
	if (change) {
		setData(data)
	}

	const handleRequestSort = (property: keyof Row) => {
		const [newOrder, newOrderBy] = setSort(property, order, orderBy)
		setOrder(newOrder)
		setOrderBy(newOrderBy)
	}

	return <TableContainer sx={{overflowY: 'auto'}} component="div" title={props.title}>
		<Table size="medium">
			<TableHead>
				<TableRow>
					{(props.delete ?? props.edit) && <TableCell key="actions" padding="checkbox"/>}
					{Array.from(props.cols.entries()).map(cd => {
						const [key, colDef] = cd
						if (!colDef.hide) {
							return <TableCell key={key.toString()} sortDirection={orderBy === key ? order : false}
													sx={{resize: "horizontal", overflow: "hidden"}}>
								{colDef.sort ? <TableSortLabel
												active={orderBy === key}
												direction={orderBy === key ? order : 'asc'}
												onClick={() => handleRequestSort(key)}>
											{colDef.name ?? capitalizeFirstLetter(key.toString())}
										</TableSortLabel>
										:
										colDef.name ?? capitalizeFirstLetter(key.toString())
								}
							</TableCell>
						}
					})}
				</TableRow>
			</TableHead>
			<TableBody>
				{Array.from(data.entries())
						.sort(getComparator<Row>(order, orderBy, props.cols.get(orderBy)?.preSort))
						.map(([, col]) => {
							return <TableRow hover key={col.data.id} data-id={col.data.id} sx={{position: 'relative'}}>
								{(props.delete ?? props.edit) && <TableCell>
									<Stack direction="row">
										{col.edit ?
												<IconButton color="default" onClick={() => {
													col.edit = false
													setData(new Map(data))
												}}><CloseIcon/>
												</IconButton>
												:
												props.delete && <IconButton color="error" onClick={() => {
													props.delete && props.delete(col.data.id)
													data.delete(col.data.id)
													setData(new Map(data))
												}}><DeleteIcon/>
												</IconButton>
										}
										{col.edit ?
												<IconButton color="success" onClick={() => {
													col.edit = false
													col.data = {...col.temp}
													props.edit && props.edit(col.data)
													setData(new Map(data))
												}}><SaveButton/>
												</IconButton>
												:
												props.edit && <IconButton color="default" onClick={() => {
													col.edit = true
													col.temp = {...col.data}
													setData(new Map(data))
												}}><EditIcon/>
												</IconButton>
										}
										{col.edit && Array.from(props.cols.values()).some((col) => col.extraEdit || col.extraShow) && <IconButton
												color="info"
												onClick={() => {
													col.dialogOpen = !col.dialogOpen
													setData(new Map(data))
												}}><HandymanIcon/>
										</IconButton>
										}
										{col.dialogOpen && <Dialog open={col.dialogOpen} onClose={() => {
											col.dialogOpen = false
											setData(new Map(data))
										}} fullWidth>
											<DialogTitle variant="h5">Edit Grade</DialogTitle>
											<DialogContent>
												<Paper elevation={4} variant="elevation" sx={{padding: 2, marginTop: 2}} square>
													<Grid container spacing={4} padding={2}>
														{Array.from(props.cols.entries()).map(cd => {
															const [key, colDef] = cd
															if (colDef.extraEdit) {
																// TODO update grid values
																return <Grid key={key as Key} item xs={12} sm={6} lg={6}>
																	<Stack spacing={2} onChange={forceUpdate}>
																		<Typography variant="h6"
																						fontWeight="normal">{colDef.name ?? capitalizeFirstLetter(key as string)}</Typography>
																		{colDef.edit(col.temp, forceUpdate) as ReactNode}
																	</Stack>
																</Grid>
															} else if (colDef.extraShow) {
																return <Grid key={key as Key} item xs={12} sm={6} lg={6}>
																	<Stack spacing={2}>
																		<Typography variant="h6"
																						fontWeight="normal">{colDef.name ?? capitalizeFirstLetter(key as string)}</Typography>
																		{(colDef.format ?? ((d: Row) =>
																				<Typography>{d[key] as ReactNode}</Typography>))(col.temp)}
																	</Stack>
																</Grid>
															}
														})}
							</Grid>
						</Paper>
						</DialogContent>
						</Dialog>
						}
						</Stack>
						</TableCell>
						}
							{
								Array.from(props.cols.entries()).map(cd => {
									const [key, colDef] = cd
									if (!colDef.hide) {
										const format = colDef.format ?? ((d: Row) => <Typography>{d[key] as ReactNode}</Typography>)
										const edit = (colDef?.edit ?? (() => format(col.data)))

										return col.edit ? colDef.extraEdit ?
														<TableCell key={key as Key} data-key={key} data-data={col.data[key]}>
															{format(col.temp)}
														</TableCell> :
														<TableCell key={key as Key} onChange={forceUpdate} data-key={key} data-data={col.data[key]}>
															{edit(col.temp, forceUpdate)}
														</TableCell>
												:
												<TableCell key={key as Key} data-key={key} data-data={col.data[key]}>
													{format(col.data)}
												</TableCell>
									} else {
										return <TableCell key={key as Key} data-key={key} data-data={col.data[key]} sx={{display: 'none'}}>
											<Typography>{col.data[key] as ReactNode}</Typography>
										</TableCell>
									}
								})
							}
						</TableRow>
							
						})}
			</TableBody>
		</Table>
	</TableContainer>
}

export type {
	IRow,
			ColumnDef,
			Column
}