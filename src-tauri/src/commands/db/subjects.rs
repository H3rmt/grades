use error_stack::{IntoReport, ResultExt};
use sea_orm::DatabaseConnection;
use tokio::sync::Mutex;

use entity::prelude::Subject;

use crate::{
	commands::utils::{CommandError, LogAndString},
	commands::utils::Delete,
	db::subjects::{create_subject, delete_subject, edit_subject, get_subjects},
};
use crate::config::main::Config;
use crate::utils::StrError;

#[tauri::command]
pub async fn get_subjects_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let subjects = get_subjects(&connection)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	let data = serde_json::to_string(&subjects)
			.into_report()
			.attach_printable("Error serializing data to json")
			.attach_printable_lazy(|| format!("subjects: {:?}", subjects))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("get_subjects_js json: {}", data);
	Ok(data)
}

#[tauri::command]
pub async fn create_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("create_subject_js json: {}", json);
	
	let model: Subject = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing subject from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	create_subject(&connection, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("edit_subject_js json: {}", json);
	
	let model: Subject = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing subject from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	edit_subject(&connection, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_subject_js(connection: tauri::State<'_, DatabaseConnection>, config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("delete_subject_js json: {}", json);
	
	let delete: Delete = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing delete from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	let grade_modal_defaults = {
		let mutex = config.lock().await;
		mutex.get().grade_modal_defaults.clone()
	};
	
	if grade_modal_defaults.subject_default == Some(delete.id) {
		return Err(StrError("Cannot delete default subject".to_string()))
				.into_report()
				.change_context(CommandError)
				.log_and_to_string();
	}
	
	delete_subject(&connection, delete.id)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}