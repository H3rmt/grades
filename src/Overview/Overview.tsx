import React, {useState} from 'react';
import {Button} from "@mui/material";
import {invoke} from "@tauri-apps/api";

function Overview() {
	const [count, setCount] = useState(1);

	const doo = () => {
		invoke('update_count', {update: 1}).then((c: any) => setCount(c))

	}

	return (<div>
		Overview<br/>
		Overview<br/>
		Overview<br/>
		Overview<br/>
		Overview
		<Button onClick={doo}>TEXT</Button>
		<p>{count}</p>
	</div>);
}

export default Overview;