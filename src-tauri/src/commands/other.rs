use tauri::{AppHandle, Wry};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[tauri::command]
pub async fn get_info_js(app_handle: AppHandle<Wry>) -> Result<String, String> {
	let version = app_handle.config().package.version.as_ref().expect("version not found").clone();
	let name = app_handle.config().package.product_name.as_ref().expect("name not found").clone();
	
	let data = Info {
		name,
		version,
	};
	
	let data = serde_json::to_string(&data).map_err(|e| {
		eprintln!("json get info Err: {}", e);
		format!("Error serialising Info to JSON: {}", e)
	})?;
	
	println!("json get info: {}", data);
	
	Ok(data)
}

#[derive(TS, Serialize, Deserialize, Debug)]
#[ts(export, export_to = "../../../src/entity/info.ts")]
struct Info {
	version: String,
	name: String,
}