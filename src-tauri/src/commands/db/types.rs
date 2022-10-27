use sea_orm::DatabaseConnection;

use crate::db::types::get_types;

#[tauri::command]
pub async fn get_types_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let types = get_types(&connection).await.map_err(|e| {
		eprintln!("get types Err: {e}");
		format!("Error getting Types from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&types).map_err(|e| {
		eprintln!("json get types Err: {e}");
		format!("Error serialising Types to JSON: {}", e)
	})?;
	
	println!("json get types {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	Err(format!("Not implemented"))
}

#[tauri::command]
pub async fn edit_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	Err(format!("Not implemented"))
}

#[tauri::command]
pub async fn delete_type_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	Err(format!("Not implemented"))
}