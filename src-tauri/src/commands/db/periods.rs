use sea_orm::DatabaseConnection;

use entity::periods;

use crate::db::periods::{create_period, delete_period, edit_period, get_periods};
use crate::commands::other::Delete;

#[tauri::command]
pub async fn get_periods_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let periods = get_periods(&connection).await.map_err(|e| {
		eprintln!("get periods Err: {}", e);
		format!("Error getting Periods from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&periods).map_err(|e| {
		eprintln!("json get periods Err: {}", e);
		format!("Error serialising Periods to JSON: {}", e)
	})?;
	
	println!("json get periods: {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create grade: {}", json);
	
	let json: periods::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create period Err: {}", e);
		format!("Error serialising Period from JSON: {}", e)
	})?;
	
	create_period(&connection, json.name, json.from, json.to).await.map_err(|e| {
		eprintln!("create period Err: {}", e);
		format!("Error creating Period: {}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json edit period: {}", json);
	
	let json: periods::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json edit period Err: {}", e);
		format!("Error serialising Period from JSON: {}", e)
	})?;
	
	edit_period(&connection, json.id, json.name, json.from, json.to).await.map_err(|e| {
		eprintln!("edit period Err: {}", e);
		format!("Error editing Period: {}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete period: {}", json);
	
	let json: Delete = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json delete period Err: {}", e);
		format!("Error serialising Delete from JSON: {}", e)
	})?;
	
	delete_period(&connection, json.id).await.map_err(|e| {
		eprintln!("delete period Err: {}", e);
		format!("Error deleting Period: {}", e)
	})?;
	
	Ok(())
}