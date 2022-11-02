use sea_orm::DatabaseConnection;

use entity::subjects;

use crate::db::subjects::{create_subject, delete_subject, edit_subject, get_subjects};
use crate::Delete;

#[tauri::command]
pub async fn get_subjects_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let subjects = get_subjects(&connection).await.map_err(|e| {
		eprintln!("get subjects Err: {}", e);
		format!("Error getting Subjects from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&subjects).map_err(|e| {
		eprintln!("json get subjects Err: {}", e);
		format!("Error serialising Subjects to JSON: {}", e)
	})?;
	
	println!("json get subjects: {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create subject: {}", json);
	
	let json: subjects::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create subject Err: {}", e);
		format!("Error serialising Subject from JSON: {}", e)
	})?;
	
	create_subject(&connection, json.name, json.color).await.map_err(|e| {
		eprintln!("create subject Err: {}", e);
		format!("Error creating Subject: {}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json edit subject: {}", json);
	
	let json: subjects::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json edit subject Err: {}", e);
		format!("Error serialising Subject from JSON: {}", e)
	})?;
	
	edit_subject(&connection, json.id, json.name, json.color).await.map_err(|e| {
		eprintln!("edit subject Err: {}", e);
		format!("Error editing Subject: {}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_subject_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete subject: {}", json);
	
	let json: Delete = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json delete subject Err: {}", e);
		format!("Error serialising Delete from JSON: {}", e)
	})?;
	
	delete_subject(&connection, json.id).await.map_err(|e| {
		eprintln!("delete subject Err: {}", e);
		format!("Error deleting Subject: {}", e)
	})?;
	
	Ok(())
}