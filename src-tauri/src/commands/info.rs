use error_stack::{IntoReport, ResultExt};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Wry};
use ts_rs::TS;
use crate::built_info;

use crate::commands::utils::{CommandError, LogAndString};

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
	
	let info = Info {
		name,
		version,
		authors: built_info::PKG_AUTHORS.to_string(),
		target: built_info::TARGET.to_string(),
		profile: built_info::PROFILE.to_string(),
		commit_hash: built_info::GIT_COMMIT_HASH.unwrap_or_default().to_string(),
	};
	
	let data = serde_json::to_string(&info)
			.into_report()
			.attach_printable("Error serializing info to json")
			.attach_printable(format!("info: {:?}", info))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("get_info_js json: {}", data);
	Ok(data)
}

#[derive(TS, Serialize, Deserialize, Debug)]
#[ts(export, export_to = "../../../src/entity/info.ts")]
struct Info {
	version: String,
	name: String,
	authors: String,
	target: String,
	profile: String,
	commit_hash: String,
}