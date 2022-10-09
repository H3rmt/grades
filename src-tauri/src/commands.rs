use sea_orm::DatabaseConnection;

use entity::grades;

use crate::db::grades::{create_grade, get_grades};
use crate::db::periods::get_periods;
use crate::db::subjects::get_subjects;
use crate::db::types::get_types;

use super::AppState;

#[tauri::command]
pub async fn create_grade_js(state: tauri::State<'_, AppState>, json: String) -> Result<(), String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	println!("json create grade: {}", json);
	
	let json: grades::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create grade Err: {e}");
		format!("Error serialising Grade from JSON: {}", e)
	})?;
	
	create_grade(connection, json.subject, json.r#type, json.info, json.grade).await.map_err(|e| {
		eprintln!("create grade Err: {e}");
		format!("Error creating Grade:{}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn get_subjects_js(state: tauri::State<'_, AppState>) -> Result<String, String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	
	let subjects = get_subjects(connection).await.map_err(|e| {
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
pub async fn get_types_js(state: tauri::State<'_, AppState>) -> Result<String, String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	
	let types = get_types(connection).await.map_err(|e| {
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
pub async fn get_grades_js(state: tauri::State<'_, AppState>) -> Result<String, String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	
	let grades = get_grades(connection).await.map_err(|e| {
		eprintln!("get grades Err: {e}");
		format!("Error getting Grades from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&grades).map_err(|e| {
		eprintln!("json get grades Err: {e}");
		format!("Error serialising Grades to JSON: {}", e)
	})?;
	
	println!("json get grades: {}", data);
	
	Ok(data)
}


#[tauri::command]
pub async fn get_periods_js(state: tauri::State<'_, AppState>) -> Result<String, String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	
	let periods = get_periods(connection).await.map_err(|e| {
		eprintln!("get periods Err: {e}");
		format!("Error getting Periods from DB: {}", e)
	})?;
	
	let data = serde_json::to_string(&periods).map_err(|e| {
		eprintln!("json get periods Err: {e}");
		format!("Error serialising Periods to JSON: {}", e)
	})?;
	
	println!("json get periods: {}", data);
	
	Ok(data)
}



