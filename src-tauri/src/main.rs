#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

use std::sync::Mutex;

embed_migrations!("./migrations/");

struct AppState {
	count: Mutex<i64>,
}

#[tauri::command]
fn get_count(state: tauri::State<AppState>) -> i64 {
	state.count.lock().unwrap().clone()
}

#[tauri::command]
fn update_count(update: i64, state: tauri::State<AppState>) -> i64 {
	let mut cnt = state.count.lock().unwrap();
	*cnt += update;
	cnt.clone()
}

fn main() {
	let state = AppState {
		count: Default::default(),
	};
	
	tauri::Builder::default().manage(state).invoke_handler(
		tauri::generate_handler![get_count,update_count]
	).run(tauri::generate_context!()).expect("error while running tauri application");
}