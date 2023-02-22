import {CartesianGrid, Legend, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis} from "recharts"
import {ReactNode, useState} from "react"
import {Fab, Paper, useTheme} from "@mui/material"
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap'
import {CategoricalChartState} from "recharts/types/chart/generateCategoricalChart"

type Data = { [key: string]: number }

type LineT = {
	name: string
	color: string
}

type Props = {
	data: Data[],
	lines: LineT[]
	extra?: ReactNode
	width?: number
	height?: number
	YAxisDomain?: [number, number]
};

const getAxisYDomain = (data: Data[], from: number, to: number, refs: string[], offset = 0.05) => {
	const refData = data.slice(from - 1, to)

	let [bottom, top] = [Infinity, -Infinity]

	refs.forEach(ref => {
		refData.map(d => d[ref]).forEach((d: number) => {
			if (d > top) top = d
			if (d < bottom) bottom = d
		})
	})

	return [Math.round(bottom - ((top - bottom) * offset)), Math.round(top + ((top - bottom) * offset))]
}

type State = {
	zoomingAreaStart: number | undefined
	zoomingAreaEnd: number | undefined
	zoomLeft: number | string
	zoomRight: number | string
	zoomTop: number | string
	zoomBottom: number | string
}

const initialState = {
	zoomingAreaStart: undefined,
	zoomingAreaEnd: undefined,
	zoomLeft: 'dataMin',
	zoomRight: 'dataMax',
	zoomTop: 'dataMax',
	zoomBottom: 'dataMin',
}

export function Chart(props: Props) {
	const [state, setState] = useState<State>(initialState)
	const theme = useTheme()

	const zoom = () => {
		let {zoomingAreaStart, zoomingAreaEnd} = state

		if (zoomingAreaEnd === undefined || zoomingAreaStart === undefined || zoomingAreaStart === zoomingAreaEnd) {
			setState({
				...state,
				zoomingAreaStart: undefined,
				zoomingAreaEnd: undefined,
			})
			return
		}

		// switch end and start if zoomed in the opposite direction
		if (zoomingAreaEnd < zoomingAreaStart) {
			[zoomingAreaEnd, zoomingAreaStart] = [zoomingAreaStart, zoomingAreaEnd]
		}

		const [bottom, top] = getAxisYDomain(props.data, Number(zoomingAreaStart), Number(zoomingAreaEnd), ['uv', 'pv'])

		setState({
			zoomingAreaStart: undefined,
			zoomingAreaEnd: undefined,
			zoomLeft: zoomingAreaStart,
			zoomRight: zoomingAreaEnd,
			zoomBottom: bottom,
			zoomTop: top
		})
	}

	const click = (nextState: CategoricalChartState, event: MouseEvent) => {
		if (event.button == 2)
			setState(initialState)
		else
			setState({...state, zoomingAreaStart: Number(nextState?.activeLabel ?? undefined)})
	}

	const {zoomLeft, zoomRight, zoomingAreaStart, zoomingAreaEnd, zoomTop, zoomBottom} = state

	return <Paper sx={{userSelect: 'none', overflow: "auto", padding: 1, position: 'relative'}} variant="outlined">
		{zoomLeft !== 'dataMin' && zoomRight !== 'dataMax' && <Fab size="small" color="primary" sx={{position: 'absolute', top: 35, left: 20}}
																					  onClick={() => setState(initialState)}>
			<ZoomOutMapIcon/>
		</Fab>}

		<LineChart
				width={props.width || 800}
				height={props.height || 400}
				data={props.data}
				style={{backgroundColor: 'transparent'}}
				onMouseDown={click}
				onMouseMove={(e) => setState({...state, zoomingAreaEnd: Number(e.activeLabel) || undefined})}
				onMouseUp={() => zoom()}
		>
			{/*<CartesianGrid stroke={theme.palette.secondary.main} strokeDasharray="5 5"/>*/}

			<XAxis stroke={theme.palette.secondary.main} allowDataOverflow domain={[zoomLeft, zoomRight]} dataKey="x" type="category"/>
			<YAxis stroke={theme.palette.secondary.main} allowDataOverflow domain={props?.YAxisDomain ?? [0, 15]} type="number"/> {/*domain={[zoomBottom, zoomTop]}*/}

			{props.extra}

			<Tooltip animationDuration={100} wrapperStyle={{minWidth: 100, color: '#fff'}} contentStyle={{
				color: theme.palette.primary.main,
				backgroundColor: theme.palette.background.default,
				borderColor: theme.palette.secondary.main
			}}/>

			<Legend/>

			{props.lines.map((line, i) =>
					<Line animationDuration={500} key={i} type="monotone" dataKey={line.name} stroke={line.color} strokeWidth={4}/>
			)}

			{zoomingAreaStart && zoomingAreaEnd &&
					<ReferenceArea x1={zoomingAreaStart} x2={zoomingAreaEnd} strokeOpacity={0.3}/>
			}
		</LineChart>
	</Paper>
}