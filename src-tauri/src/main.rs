#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use tauri::Manager;
use tokio::sync::Mutex;

use cache::cache::Cache;
use commands::cache::cache::{get_page_from_cache_js, store_page_in_cache_js};
use commands::config::config::{get_grade_modal_defaults_js, get_note_rage_js, save_grade_modal_defaults_js, save_note_range_js};
use commands::db::grades::{create_grade_js, delete_grade_js, edit_grade_js, get_grades_js};
use commands::db::periods::{create_period_js, delete_period_js, edit_period_js, get_periods_js};
use commands::db::subjects::{create_subject_js, delete_subject_js, edit_subject_js, get_subjects_js};
use commands::db::types::{create_type_js, delete_type_js, edit_type_js, get_types_js};
use commands::other::{get_info_js};
use migrations::{Migrator, MigratorTrait};

mod db;
mod commands;
mod dirs;
mod cache;
mod config;

#[tokio::main]
async fn main() {
	env_logger::init();
	tauri::async_runtime::set(tokio::runtime::Handle::current());
	
	let connection = db::database::establish_connection().await.expect("Error connecting to DB");
	Migrator::up(&connection, None).await.expect("Error running migrations");
	
	// dont panic on cache missing
	let cache = Mutex::new(cache::create().expect("Error connecting to cache"));
	
	// dont panic on config missing
	let config = Mutex::new(config::create().expect("Error connecting to config"));
	
	tauri::Builder::default()
			.setup(|app| {
				#[cfg(debug_assertions)] // only include this code on debug builds
				{
					let window = app.get_window("main").unwrap();
					window.open_devtools();
					window.close_devtools();
				}
				
				println!("version: {}", app.config().package.version.as_ref().unwrap());
				Ok(())
			})
			.manage(connection)
			.manage(cache)
			.manage(config)
			.invoke_handler(tauri::generate_handler![
				get_grades_js, create_grade_js, edit_grade_js, delete_grade_js,
				get_periods_js, create_period_js, edit_period_js, delete_period_js,
				get_types_js, create_type_js, edit_type_js, delete_type_js,
				get_subjects_js, create_subject_js, edit_subject_js, delete_subject_js,
				store_page_in_cache_js,get_page_from_cache_js, get_info_js,
				get_note_rage_js,get_grade_modal_defaults_js, save_note_range_js, save_grade_modal_defaults_js
        ])
			.run(tauri::generate_context!())
			.expect("error while running tauri application");
}

pub mod built_info {
	// The file has been placed there by the build script.
	include!(concat!(env!("OUT_DIR"), "/built.rs"));
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Delete {
	id: i32,
}
