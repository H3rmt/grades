use sea_orm::DatabaseConnection;
use super::AppState;

#[tauri::command]
pub fn create_grade_js(state: tauri::State<AppState>, json: &str) -> Result<String, String> {
	let connection: &DatabaseConnection = &state.0 as &DatabaseConnection;
	println!("{:#?}", connection);
	println!("json{:#?}", json);
//	Ok("This worked!".into())
	Err("Failed to create Grade, because DB failed".into())
}

