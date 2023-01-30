use error_stack::{IntoReport, ResultExt};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::built_info;
use crate::commands::utils::{CommandError, LogAndString};

#[tauri::command]
pub async fn get_info_js() -> Result<String, String> {
	let info = Info {
		name: built_info::PKG_NAME.to_string(),
		version: built_info::PKG_VERSION.to_string(),
		authors: built_info::PKG_AUTHORS.to_string(),
		target: built_info::TARGET.to_string(),
		profile: built_info::PROFILE.to_string(),
		build_on: built_info::CI_PLATFORM.unwrap_or("local").to_string(),
		build_time: built_info::BUILT_TIME_UTC.to_string(),
		repository: built_info::PKG_REPOSITORY.to_string(),
		commit_hash_short: built_info::GIT_COMMIT_HASH_SHORT.unwrap_or("GIT_COMMIT_HASH_SHORT MISSING").to_string(),
	};
	
	// config.lock().await.set(|c| c.analysis = vec![AnalysisBox { test: vec![AnalysisBoxPoint { x: 12, y: 1 }], test2: None }, AnalysisBox { test: vec![AnalysisBoxPoint { x: 1, y: 24 }, AnalysisBoxPoint { x: 12, y: 1 }], test2: Some(AnalysisBoxPoint { x: 14, y: 6 }) }]).unwrap();
	
	let data = serde_json::to_string(&info)
			.into_report()
			.attach_printable("Error serializing info to json")
			.attach_printable_lazy(|| format!("info: {:?}", info))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("get_info_js json: {}", data);
	Ok(data)
}

#[derive(TS, Serialize, Deserialize, Debug)]
#[ts(export, export_to = "../src/entity/info.ts")]
struct Info {
	version: String,
	name: String,
	authors: String,
	target: String,
	profile: String,
	build_on: String,
	build_time: String,
	repository: String,
	commit_hash_short: String,
}