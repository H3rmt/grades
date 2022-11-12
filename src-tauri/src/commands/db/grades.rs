use error_stack::{ResultExt, IntoReport};
use sea_orm::DatabaseConnection;
use log;
use entity::grades::Model;

use crate::db::grades::{create_grade, delete_grade, edit_grade, get_grades};
use crate::commands::other::{CommandError, Delete};

#[tauri::command]
pub async fn get_grades_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let grades = get_grades(&connection)
			.await
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{}", e);
				e.to_string()
			})?;
	
	
	let data = serde_json::to_string(&grades)
			.into_report()
			.attach_printable_lazy(|| "Error serializing grades")
			.attach_printable_lazy(|| format!("grades: {:?}", grades))
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{}", e);
				e.to_string()
			})?;
	
	println!("json get grades: {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create grade: {}", json);
	
	let model: Model = serde_json::from_str(&json)
			.into_report()
			.attach_printable_lazy(|| "Error serializing grade")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{:?}", e);
				e.to_string()
			})?;
	
	create_grade(&connection, model)
			.await
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{:?}", e);
				e.to_string()
			})?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json edit grade: {}", json);
	
	let model: Model = serde_json::from_str(&json)
			.into_report()
			.attach_printable_lazy(|| "Error serializing grade")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{:?}", e);
				e.to_string()
			})?;
	
	edit_grade(&connection, model)
			.await
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{:?}", e);
				e.to_string()
			})?;
	
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
			.map_err(|e| {
				log::error!("{:?}", e);
				e.to_string()
			})?;
	
	delete_grade(&connection, delete)
			.await
			.change_context(CommandError)
			.map_err(|e| {
				log::error!("{:?}", e);
				e.to_string()
			})?;
	
	Ok(())
}