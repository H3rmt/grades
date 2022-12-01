use error_stack::{IntoReport, ResultExt};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Wry};
use ts_rs::TS;

use crate::commands::other::{CommandError, LogAndString};

#[tauri::command]
pub async fn get_info_js(app_handle: AppHandle<Wry>) -> Result<String, String> {
	let version = app_handle.config().package.version.clone().unwrap_or_else(|| {
		log::warn!("No version found");
		"version not found".to_string()
	});
	
	let name = app_handle.config().package.product_name.clone().unwrap_or_else(|| {
		log::warn!("No name found");
		"name not found".to_string()
	});
	
	let data = Info {
		name,
		version,
	};
	
	let data = serde_json::to_string(&data)
			.into_report()
			.attach_printable("Error serializing Info to json")
			.attach_printable(format!("data: {:?}", data))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("json get info: {}", data);
	Ok(data)
}

#[derive(TS, Serialize, Deserialize, Debug)]
#[ts(export, export_to = "../../../src/entity/info.ts")]
struct Info {
	version: String,
	name: String,
}
