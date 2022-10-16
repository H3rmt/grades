use sea_orm::DatabaseConnection;
use tokio::sync::Mutex;

use entity::grades;

use crate::Cache;
use crate::cache::cache::Page;
use crate::db::grades::{create_grade, get_grades};
use crate::db::periods::get_periods;
use crate::db::subjects::get_subjects;
use crate::db::types::get_types;

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
pub async fn store_page_in_cache_js(cache: tauri::State<'_, Mutex<Cache>>, json: String) -> Result<(), String> {
	println!("json set page: {}", json);
	
	let json: Page = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json set page Err: {e}");
		format!("Error serialising SetPage from JSON: {}", e)
	})?;
	
	{
		let mut c = cache.lock().await;
		c.get_mut().page = Some(json);
		c.save().map_err(|e| {
			eprintln!("set Page Err: {e}");
			format!("Error setting Page:{}", e)
		})?;
	}
	
	Ok(())
}



