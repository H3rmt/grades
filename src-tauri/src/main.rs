#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

extern crate core;

use sea_orm::DatabaseConnection;

use migrations::{Migrator, MigratorTrait};

mod db;
mod commands;
mod dirs;


pub struct AppState(DatabaseConnection);

#[tokio::main]
async fn main() {
	tauri::async_runtime::set(tokio::runtime::Handle::current());
	
	let connection = db::database::establish_connection().await.expect("Error connecting to DB");
	
	Migrator::up(&connection, None).await.expect("Error running migrations");
	
	tauri::Builder::default()
			.setup(|app| {
				#[cfg(debug_assertions)] // only include this code on debug builds
				{
					let window = app.get_window("main").unwrap();
					window.open_devtools();
					window.close_devtools();
				}
				Ok(())
			})
			.manage(AppState(connection))
			.invoke_handler(tauri::generate_handler![
				commands::create_grade_js,
				commands::get_subjects_js,
				commands::get_types_js,
				commands::get_grades_js,
				commands::get_periods_js
        ])
			.run(tauri::generate_context!())
			.expect("error while running tauri application");
}