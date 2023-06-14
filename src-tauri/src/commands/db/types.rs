use error_stack::{IntoReport, ResultExt};
use sea_orm::DatabaseConnection;
use tokio::sync::Mutex;

use entity::prelude::GradeType;

use crate::{
	commands::utils::{CommandError, LogAndString},
	db::types::{create_type, delete_type, edit_type, get_types},
};
use crate::commands::utils::Delete;
use crate::config::main::Config;
use crate::utils::StrError;

#[tauri::command]
pub async fn get_types_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let types = get_types(&connection)
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

#[tauri::command]
pub async fn create_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("create_type_js json: {}", json);
	
	let model: GradeType = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing type from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	create_type(&connection, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("edit_type_js json: {}", json);
	
	let model: GradeType = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing type")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	edit_type(&connection, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_type_js(connection: tauri::State<'_, DatabaseConnection>, config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("delete_type_js json: {}", json);
	
	let delete: Delete = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing delete")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	let grade_modal_defaults = {
		let mutex = config.lock().await;
		mutex.get().grade_modal_defaults.clone()
	};
	
	if grade_modal_defaults.type_default == Some(delete.id) {
		return Err(StrError("Cannot delete default type".to_string()))
				.into_report()
				.change_context(CommandError)
				.log_and_to_string();
	}
	
	delete_type(&connection, delete.id)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}