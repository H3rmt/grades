use tauri::{AppHandle, Wry};
use serde::{Deserialize, Serialize};
use crate::built_info;
use ts_rs::TS;

#[tauri::command]
pub async fn get_info_js(app_handle: AppHandle<Wry>) -> Result<String, String> {
	let version = app_handle.config().package.version.as_ref().expect("version not found").clone();
	let name = app_handle.config().package.product_name.as_ref().expect("name not found").clone();
	
	let data = Info {
		name,
		version,
		authors: built_info::PKG_AUTHORS.to_string(),
		target: built_info::TARGET.to_string(),
		profile: built_info::PROFILE.to_string(),
		rustc_version: built_info::RUSTC_VERSION.to_string(),
		commit: built_info::GIT_VERSION.unwrap_or_default().to_string().split('-').last().unwrap_or_default().to_string(),
		commit_hash: built_info::GIT_COMMIT_HASH.unwrap_or_default().to_string(),
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
	authors: String,
	target: String,
	profile: String,
	rustc_version: String,
	commit: String,
	commit_hash: String,
}