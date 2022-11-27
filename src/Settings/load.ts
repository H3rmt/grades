import {Info} from "../entity";
import {invoke} from "@tauri-apps/api/tauri";

async function loadInfo(): Promise<Info> {
	// @ts-ignore
	return await invoke("get_info_js").then((data: string) => {
		console.log(data)
		return JSON.parse(data)
	}).catch((error) => {
		console.error("Load info", error)
		throw error
	})
}

export {
	loadInfo
}