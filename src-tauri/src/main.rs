#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

extern crate core;

use sea_orm::DatabaseConnection;

use migrations::{Migrator, MigratorTrait};

mod db;
mod commands;


//
//#[tauri::command]
//fn todos_list(state: tauri::State<AppState>) -> String {
//	let con = state.conn.lock().unwrap();
//	db::todos_list(&con)
//}
//
//#[tauri::command]
//fn todos_create(title: String, body: String, state: tauri::State<AppState>) -> String {
//	let conn = state.conn.lock().unwrap();
//	db::todos_create(&conn, &title, &body).to_string()
//}
//
//#[tauri::command]
//fn todos_toggle(id: i32, state: tauri::State<AppState>) -> String {
//	let conn = state.conn.lock().unwrap();
//	db::todos_toggle(&conn, id)
//}
//
//#[tauri::command]
//fn todos_delete(id: i32, state: tauri::State<AppState>) -> String {
//	let conn = state.conn.lock().unwrap();
//	db::todos_delete(&conn, id);
//	String::from("")
//}
//

pub struct AppState(DatabaseConnection);

#[tokio::main]
async fn main() {
	tauri::async_runtime::set(tokio::runtime::Handle::current());
	
	let connection = db::establish_connection().await;
	
	// run all migrations
	Migrator::up(&connection, None).await.expect("Error running migrations");
	
	tauri::Builder::default()
			.manage(AppState(connection))
			.invoke_handler(tauri::generate_handler![
//            todos_list,
//            todos_create,
//            todos_toggle,
//            todos_delete,
        ])
			.run(tauri::generate_context!())
			.expect("error while running tauri application");
}