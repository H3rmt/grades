#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

extern crate core;

use tauri::Manager;
use tokio::sync::Mutex;

use cache::cache::Cache;
use migrations::{Migrator, MigratorTrait};

mod db;
mod commands;
mod dirs;
mod cache;
mod config;


#[tokio::main]
async fn main() {
	tauri::async_runtime::set(tokio::runtime::Handle::current());
	
	let connection = db::database::establish_connection().await.expect("Error connecting to DB");
	Migrator::up(&connection, None).await.expect("Error running migrations");
	
	// dont panic on cache missing
	let cache = Mutex::new(cache::init::connect().expect("Error connecting to cache"));
	
	// dont panic on config missing
	let config = Mutex::new(config::init::connect().expect("Error connecting to config"));
	
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
			.manage(connection)
			.manage(cache)
			.manage(config)
			.invoke_handler(tauri::generate_handler![
				commands::db::create_grade_js,
				commands::db::get_subjects_js,
				commands::db::get_types_js,
				commands::db::get_grades_js,
				commands::db::get_periods_js,
				commands::cache::store_page_in_cache_js,
				commands::cache::get_page_from_cache_js,
				commands::config::get_note_rage_js,
				commands::config::get_grade_modal_defaults
        ])
			.run(tauri::generate_context!())
			.expect("error while running tauri application");
}