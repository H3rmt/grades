use error_stack::{IntoReport, ResultExt};
use sea_orm::DatabaseConnection;
use tokio::sync::Mutex;

use entity::grades::Model;

use crate::commands::other::{CommandError, Delete, LogAndString};
use crate::config::config::Config;
use crate::db::grades::{create_grade, delete_grade, edit_grade, get_grades};

#[tauri::command]
pub async fn get_grades_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let grades = get_grades(&connection)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	
	let data = serde_json::to_string(&grades)
			.into_report()
			.attach_printable("Error serializing Vec<Grades> to json")
			.attach_printable(format!("grades: {:?}", grades))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("get_grades_js json: {}", data);
	Ok(data)
}

#[tauri::command]
pub async fn create_grade_js(connection: tauri::State<'_, DatabaseConnection>, config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("json create grade: {}", json);
	
	let model: Model = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing grade")
			.attach_printable(format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	create_grade(&connection, &config, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_grade_js(connection: tauri::State<'_, DatabaseConnection>, config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	println!("json edit grade: {}", json);
	
	let model: Model = serde_json::from_str(&json)
			.into_report()
			.attach_printable_lazy(|| "Error serializing grade")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	edit_grade(&connection, &config, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete grade: {}", json);
	
	let delete: Delete = serde_json::from_str(&json)
			.into_report()
			.attach_printable_lazy(|| "Error serializing delete")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	delete_grade(&connection, delete.id)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}