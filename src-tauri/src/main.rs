#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::sync::mpsc::channel;

use error_stack::{IntoReport, ResultExt};
use serde_json::Value;
use tauri::Manager;
use tokio::sync::Mutex;

use commands::{
	cache::{edit_page_in_cache_js, get_page_from_cache_js},
	config::{edit_grade_modal_defaults_js, edit_note_range_js, get_grade_modal_defaults_js, get_note_range_js, reset_grade_modal_defaults_js, reset_note_range_js},
	db::{
		grades::{create_grade_js, delete_grade_js, edit_grade_js, get_grades_js},
		periods::{create_period_js, delete_period_js, edit_period_js, get_periods_js},
		subjects::{create_subject_js, delete_subject_js, edit_subject_js, get_subjects_js},
		types::{create_type_js, delete_type_js, edit_type_js, get_types_js},
		weights::get_weights_js,
	},
	info::get_info_js,
};
use logging::logger;
use migrations::{Migrator, MigratorTrait};

mod db;
mod commands;
mod dirs;
mod cache;
mod config;
mod utils;
mod logging;

#[tokio::main]
async fn main() {
	logger()
			.attach_printable("Error initializing logger")
			.map_err(|e| {
				eprintln!("{:?}", e);
			}).expect("Error initializing logger");
	
	#[cfg(not(debug_assertions))]
	log::info!("version:{}; target:{}; host:{}; profile:{}; commit_hash:{}; OS:{}, build_on:{}",
	         built_info::PKG_VERSION, built_info::TARGET, built_info::HOST, built_info::PROFILE, built_info::GIT_COMMIT_HASH.unwrap_or("GIT_COMMIT_HASH MISSING"), built_info::CFG_OS, built_info::CI_PLATFORM.unwrap_or("local"));
	
	tauri::async_runtime::set(tokio::runtime::Handle::current());
	
	let connection = db::database::establish_connection()
			.await
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("Error connecting to DB");
	
	// TODO move into setup
	Migrator::up(&connection, None)
			.await
			.into_report()
			.attach_printable("Error running migrations")
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("Error running migrations");
	
	let cache = Mutex::new(cache::create()
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("Error connecting to cache"));
	
	let config = Mutex::new(config::create()
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("Error connecting to config"));
	
	tauri::Builder::default()
			.setup(|_app| {
				#[cfg(debug_assertions)]
				{
					let window = _app.get_window("main").unwrap();
					window.open_devtools();
					window.close_devtools();
				}
				Ok(())
			})
			.setup(|app| {
				if let Ok(matches) = app.get_cli_matches() {
					println!();
					for m in matches.args {
						match (m.0.as_ref(), m.1) {
							("update", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										let (tx, rx) = channel();
										let handle = app.handle();
										tauri::async_runtime::spawn(async move {
											match handle.updater().check().await {
												Ok(update) => {
													if update.is_update_available() {
														log::info!("Update available: {}", update.latest_version());
														if let Err(e) = update.download_and_install().await {
															log::error!("Error downloading update: {}", e);
														} else {
															log::info!("Update successfully");
														}
													} else {
														log::error!("No update available");
													}
												}
												Err(e) => {
													log::error!("Error checking for update: {}", e);
												}
											}
											tx.send(()).unwrap();
										});
										
										rx.recv().unwrap();
									}
								}
							}
							("help", d) => {
								println!("{}", d.value.as_str().unwrap());
							}
							("version", _) => {
								println!("{}:{}", built_info::PKG_NAME, built_info::PKG_VERSION);
							}
							_ => {}
						};
						let handle = app.handle();
						handle.exit(0)
					}
				}
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
				edit_page_in_cache_js,get_page_from_cache_js, get_info_js, get_weights_js,
				get_note_range_js, get_grade_modal_defaults_js, edit_note_range_js, edit_grade_modal_defaults_js,
				reset_grade_modal_defaults_js,reset_note_range_js
        ])
			.run(tauri::generate_context!())
			.into_report()
			.attach_printable("Error running grades")
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("error while running tauri application");
}

pub mod built_info {
	include!(concat!(env!("OUT_DIR"), "/built.rs"));
}