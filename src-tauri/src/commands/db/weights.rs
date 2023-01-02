use error_stack::{IntoReport, ResultExt};
use sea_orm::DatabaseConnection;

use crate::commands::utils::{CommandError, LogAndString};
use crate::db::weights::get_weights;

#[tauri::command]
pub async fn get_weights_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let types = get_weights(&connection)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	let data = serde_json::to_string(&types)
			.into_report()
			.attach_printable("Error serializing data to json")
			.attach_printable_lazy(|| format!("types: {:?}", types))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("get_types_js json: {}", data);
	Ok(data)
}