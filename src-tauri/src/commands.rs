use sea_orm::DatabaseConnection;
use serde::{Deserialize, Serialize};

use crate::db::create_grade;

use super::AppState;

#[derive(Serialize, Deserialize)]
struct GradeJSON {
	subject: i32,
	r#type: i32,
	info: String,
	grade: i32,
}

#[tauri::command]
pub async fn create_grade_js(state: tauri::State<'_, AppState>, json: String) -> Result<(), String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	println!("{:#?}", connection);
	println!("json{:#?}", json);
	
	let json: GradeJSON = serde_json::from_str(&*json).or(Err("Error decoding js json"))?;
	
	create_grade(connection, json.subject, json.r#type, json.info, json.grade)
			.await.map_err(|e| e.to_string())?;

	Ok(())
}

