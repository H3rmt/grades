use super::AppState;

#[tauri::command]
fn create_grade_js(state: tauri::State<AppState>, _subject: &str, _grade_type: &str, _info: &str) {
	let connection = &state.0.0;
}
