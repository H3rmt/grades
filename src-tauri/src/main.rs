#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::sync::mpsc::channel;

use error_stack::{IntoReport, ResultExt};
use tokio::sync::Mutex;

use commands::{
	cache::{edit_page_in_cache_js, get_page_from_cache_js, edit_skip_version_in_cache_js, get_skip_version_in_cache_js},
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

use crate::cli::cli;

mod db;
mod commands;
mod dirs;
mod cache;
mod config;
mod utils;
mod logging;
mod cli;

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
	let conn = connection.clone();
	let conn2 = connection.clone();
	
	let cache = Mutex::new(cache::create()
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("Error connecting to cache"));
	
	let config = Mutex::new(config::create()
			.map_err(|e| {
				log::error!("{:?}", e);
			}).expect("Error connecting to config"));
	
	tauri::Builder::default()
			.setup(|app| {
				cli(app, conn2);
				
				let (tx, rx) = channel();
				tauri::async_runtime::spawn(async move {
					Migrator::up(&conn, None)
							.await
							.into_report()
							.attach_printable("Error running migrations")
							.map_err(|e| {
								log::error!("{:?}", e);
							}).expect("Error running migrations");
					tx.send(()).expect("Error sending message (update)");
				});
				rx.recv().expect("Error receiving message (update)");
				
				
				#[cfg(debug_assertions)]
				{
					use tauri::Manager;
					
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
				get_grades_js, create_grade_js, edit_grade_js, delete_grade_js,
				get_periods_js, create_period_js, edit_period_js, delete_period_js,
				get_types_js, create_type_js, edit_type_js, delete_type_js,
				get_subjects_js, create_subject_js, edit_subject_js, delete_subject_js,
				edit_page_in_cache_js,get_page_from_cache_js, get_info_js, get_weights_js,
				get_note_range_js, get_grade_modal_defaults_js, edit_note_range_js, edit_grade_modal_defaults_js,
				reset_grade_modal_defaults_js,reset_note_range_js, get_skip_version_in_cache_js, edit_skip_version_in_cache_js
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