import React from 'react'
import './index.css'
import {createRoot} from "react-dom/client";
import App from "./App";

createRoot(document.getElementById('root')!).render(
		<React.StrictMode>
			<App/>
		</React.StrictMode>
)