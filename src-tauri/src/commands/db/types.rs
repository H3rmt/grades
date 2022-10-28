use sea_orm::DatabaseConnection;

use entity::{grade_types, subjects};

use crate::db::types::get_types;
use crate::Delete;

#[tauri::command]
pub async fn get_types_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let types = get_types(&connection).await.map_err(|e| {
		eprintln!("get types Err: {}", e);
		format!("Error getting Types from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&types).map_err(|e| {
		eprintln!("json get types Err: {}", e);
		format!("Error serialising Types to JSON: {}", e)
	})?;
	
	println!("json get types {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create type: {}", json);
	
	let json: grade_types::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create type Err: {}", e);
		format!("Error serialising Type from JSON: {}", e)
	})?;
	
	create_type(&connection, json.name, json.color).await.map_err(|e| {
		eprintln!("create type Err: {}", e);
		format!("Error creating Type:{}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json edit type: {}", json);
	
	let json: grade_types::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json edit type Err: {}", e);
		format!("Error serialising Type from JSON: {}", e)
	})?;
	
	edit_type(&connection, json.id, json.name, json.color).await.map_err(|e| {
		eprintln!("edit type Err: {}", e);
		format!("Error editing Type:{}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete type: {}", json);
	
	let json: Delete = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json delete type Err: {}", e);
		format!("Error serialising Delete from JSON: {}", e)
	})?;
	
	delete_type(&connection, json.id).await.map_err(|e| {
		eprintln!("delete type Err: {}", e);
		format!("Error deleting Type:{}", e)
	})?;
	
	Ok(())
}