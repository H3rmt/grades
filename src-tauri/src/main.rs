#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use error_stack::{IntoReport, ResultExt};
use tokio::sync::Mutex;

use commands::cache::{get_page_from_cache_js, save_page_in_cache_js};
use commands::config::{get_grade_modal_defaults_js, get_note_rage_js, save_grade_modal_defaults_js, save_note_range_js};
use commands::db::grades::{create_grade_js, delete_grade_js, edit_grade_js, get_grades_js};
use commands::db::periods::{create_period_js, delete_period_js, edit_period_js, get_periods_js};
use commands::db::subjects::{create_subject_js, delete_subject_js, edit_subject_js, get_subjects_js};
use commands::db::types::{create_type_js, delete_type_js, edit_type_js, get_types_js};
use commands::info::get_info_js;
use migrations::{Migrator, MigratorTrait};

mod db;
mod commands;
mod dirs;
mod cache;
mod config;
mod utils;

#[tokio::main]
async fn main() {
	env_logger::init();
	log::info!("version:{}; target:{}; host:{}; profile:{}; commit_hash:{}; OS:{}",
	         built_info::PKG_VERSION, built_info::TARGET, built_info::HOST, built_info::PROFILE, built_info::GIT_COMMIT_HASH.unwrap_or("GIT_COMMIT_HASH MISSING"), built_info::CFG_OS);
	
	tauri::async_runtime::set(tokio::runtime::Handle::current());
	
	let connection = db::database::establish_connection()
			.await
			.map_err(|e| {
				log::error!("{}", e);
			}).expect("Error connecting to DB");
	
	Migrator::up(&connection, None)
			.await
			.into_report()
			.attach_printable("Error running migrations")
			.map_err(|e| {
				log::error!("{}", e);
			}).expect("Error running migrations");
	
	let cache = Mutex::new(cache::create()
			.map_err(|e| {
				log::error!("{}", e);
			}).expect("Error connecting to cache"));
	
	let config = Mutex::new(config::create()
			.map_err(|e| {
				log::error!("{}", e);
			}).expect("Error connecting to config"));
	
	tauri::Builder::default()
			.setup(|app| {
				#[cfg(debug_assertions)] // only include this code on debug builds
				{
					use tauri::Manager;
					let window = app.get_window("main").unwrap();
					window.open_devtools();
					window.close_devtools();
				}
				
				let handle = app.handle();
				tauri::async_runtime::spawn(async move {
					match tauri::updater::builder(handle).check().await {
						Ok(update) => {
							if update.is_update_available() {
								log::info!("Update available: {}", update.latest_version());
								if let Err(e) = update.download_and_install().await {
									log::error!("Error downloading update: {}", e);
								}
							} else {
								log::info!("No update available");
							}
						}
						Err(e) => {
							log::error!("Error checking for update: {}", e);
						}
					}
				});
				
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
				save_page_in_cache_js,get_page_from_cache_js, get_info_js,
				get_note_rage_js,get_grade_modal_defaults_js, save_note_range_js, save_grade_modal_defaults_js
        ])
			.run(tauri::generate_context!())
			.into_report()
			.attach_printable("Error running grades")
			.map_err(|e| {
				log::error!("{}", e);
			}).expect("error while running tauri application");
}

pub mod built_info {
	// The file has been placed there by the build script.
	include!(concat!(env!("OUT_DIR"), "/built.rs"));
}