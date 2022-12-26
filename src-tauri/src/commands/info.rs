use error_stack::{IntoReport, ResultExt};
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use ts_rs::TS;

use crate::built_info;
use crate::commands::utils::{CommandError, LogAndString};
use crate::config::main::Config;
use crate::config::types::{AnalysisBox, AnalysisBoxPoint};

#[tauri::command]
pub async fn get_info_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let info = Info {
		name: built_info::PKG_NAME.to_string(),
		version: built_info::PKG_VERSION.to_string(),
		authors: built_info::PKG_AUTHORS.to_string(),
		target: built_info::TARGET.to_string(),
		profile: built_info::PROFILE.to_string(),
		commit_hash: built_info::GIT_COMMIT_HASH.unwrap_or_default().to_string(),
	};
	
	config.lock().await.set(|c| c.analysis = vec![AnalysisBox { test: AnalysisBoxPoint { x: 12, y: 1 }, test2: None }, AnalysisBox { test: AnalysisBoxPoint { x: 1, y: 24 }, test2: Some(AnalysisBoxPoint { x: 14, y: 6 }) }]).unwrap();
	
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
#[ts(export, export_to = "../src/entity/info.ts")]
struct Info {
	version: String,
	name: String,
	authors: String,
	target: String,
	profile: String,
	commit_hash: String,
}