use sea_orm::DatabaseConnection;

use entity::{grades, periods};

use crate::db::grades::{create_grade, delete_grade, get_grades};
use crate::db::periods::{create_period, delete_period, edit_period, get_periods};
use crate::db::subjects::get_subjects;
use crate::db::types::get_types;
use crate::Delete;

#[tauri::command]
pub async fn create_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create grade: {}", json);
	
	let json: grades::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create grade Err: {e}");
		format!("Error serialising Grade from JSON: {}", e)
	})?;
	
	create_grade(&connection, json.subject, json.r#type, json.info, json.grade, json.period, json.not_final, json.double).await.map_err(|e| {
		eprintln!("create grade Err: {e}");
		format!("Error creating Grade:{}", e)
	})?;
	
	Ok(())
}

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
pub async fn get_grades_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let grades = get_grades(&connection).await.map_err(|e| {
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
pub async fn get_periods_js(connection: tauri::State<'_, DatabaseConnection>) -> Result<String, String> {
	let periods = get_periods(&connection).await.map_err(|e| {
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


#[tauri::command]
pub async fn delete_grade_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete grade: {}", json);
	
	let json: Delete = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json delete grade Err: {e}");
		format!("Error serialising Delete from JSON: {}", e)
	})?;
	
	delete_grade(&connection, json.id).await.map_err(|e| {
		eprintln!("delete grade Err: {e}");
		format!("Error deleting Grade:{}", e)
	})?;
	
	Ok(())
}


#[tauri::command]
pub async fn create_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json create grade: {}", json);
	
	let json: periods::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json create period Err: {e}");
		format!("Error serialising Period from JSON: {}", e)
	})?;
	
	create_period(&connection, json.name, json.from, json.to).await.map_err(|e| {
		eprintln!("create period Err: {e}");
		format!("Error creating Period:{}", e)
	})?;
	
	Ok(())
}


#[tauri::command]
pub async fn delete_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json delete period: {}", json);
	
	let json: Delete = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json delete period Err: {e}");
		format!("Error serialising Delete from JSON: {}", e)
	})?;
	
	delete_period(&connection, json.id).await.map_err(|e| {
		eprintln!("delete period Err: {e}");
		format!("Error deleting Period:{}", e)
	})?;
	
	Ok(())
}

#[tauri::command]
pub async fn edit_period_js(connection: tauri::State<'_, DatabaseConnection>, json: String) -> Result<(), String> {
	println!("json edit grade: {}", json);
	
	let json: periods::Model = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json edit grade Err: {e}");
		format!("Error serialising Grade from JSON: {}", e)
	})?;
	
	edit_period(&connection, json.id, json.name, json.from, json.to).await.map_err(|e| {
		eprintln!("edit grade Err: {e}");
		format!("Error editing Grade:{}", e)
	})?;
	
	Ok(())
}

