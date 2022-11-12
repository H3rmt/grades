use sea_orm::DatabaseConnection;

use entity::grades;

use crate::db::grades::{create_grade, delete_grade, edit_grade, get_grades};
use crate::commands::other::Delete;

#[tauri::command]
pub async fn get_grades_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let grades = get_grades(&connection).await.map_err(|e| {
		eprintln!("get grades Err: {}", e);
		format!("Error getting Grades from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&grades).map_err(|e| {
		eprintln!("json get grades Err: {}", e);
		format!("Error serialising Grades to JSON: {}", e)
	})?;
	
	println!("json get grades: {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn create_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create grade: {}", json);
	
	let json: grades::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create grade Err: {}", e);
		format!("Error serialising Grade from JSON: {}", e)
	})?;
	
	create_grade(&connection, json.subject, json.r#type, json.info, json.grade, json.period, json.not_final, json.double).await.map_err(|e| {
		eprintln!("create grade Err: {}", e);
		format!("Error creating Grade: {}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json edit grade: {}", json);
	
	let json: grades::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json edit grade Err: {}", e);
		format!("Error serialising Grade from JSON: {}", e)
	})?;
	
	edit_grade(&connection, json.id, json.subject, json.r#type, json.info, json.grade, json.period, json.not_final, json.double).await.map_err(|e| {
		eprintln!("edit grade Err: {}", e);
		format!("Error editing Grade: {}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn delete_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete grade: {}", json);
	
	let json: Delete = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json delete grade Err: {}", e);
		format!("Error serialising Delete from JSON: {}", e)
	})?;
	
	delete_grade(&connection, json.id).await.map_err(|e| {
		eprintln!("delete grade Err: {}", e);
		format!("Error deleting Grade: {}", e)
	})?;
	
	Ok(())
}