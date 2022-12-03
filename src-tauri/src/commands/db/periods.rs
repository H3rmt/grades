use error_stack::{IntoReport, ResultExt};
use sea_orm::DatabaseConnection;

use entity::prelude::Period;

use crate::{
	commands::utils::{CommandError, Delete, LogAndString},
	db::periods::{create_period, delete_period, edit_period, get_periods},
};

#[tauri::command]
pub async fn get_periods_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let periods = get_periods(&connection)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	let data = serde_json::to_string(&periods)
			.into_report()
			.attach_printable("Error serializing data to json")
			.attach_printable(format!("periods: {:?}", periods))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	log::debug!("get_periods_js json: {}", data);
	Ok(data)
}

#[tauri::command]
pub async fn create_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("create_period_js json: {}", json);
	
	let model: Period = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing period from json")
			.attach_printable(format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	create_period(&connection, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("edit_period_js json: {}", json);
	
	let model: Period = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing period")
			.attach_printable(format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	edit_period(&connection, model)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	log::debug!("json delete period: {}", json);
	
	let delete: Delete = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error serializing delete")
			.attach_printable(format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	delete_period(&connection, delete.id)
			.await
			.change_context(CommandError)
			.log_and_to_string()?;
	
	Ok(())
}