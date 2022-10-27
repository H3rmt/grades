use sea_orm::DatabaseConnection;

use crate::db::subjects::get_subjects;

#[tauri::command]
pub async fn get_subjects_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let subjects = get_subjects(&connection).await.map_err(|e| {
		eprintln!("get subjects Err: {e}");
		format!("Error getting Subjects from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&subjects).map_err(|e| {
		eprintln!("json get subjects Err: {e}");
		format!("Error serialising Subjects to JSON: {}", e)
	})?;
	
	println!("json get subjects: {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	Err(format!("Not implemented"))
}

#[tauri::command]
pub async fn edit_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	Err(format!("Not implemented"))
}

#[tauri::command]
pub async fn delete_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	Err(format!("Not implemented"))
}