extern crate dirs;

use std::fmt;
use std::path::PathBuf;

use error_stack::{IntoReport, Result, ResultExt};

use crate::utils::StrError;

#[cfg(not(debug_assertions))]
const APPLICATION_NAME: &str = "grades";
#[cfg(debug_assertions)]
const APPLICATION_NAME: &str = "grades-dev";

const DB_NAME: &str = "db.db";
const CONF_NAME: &str = "conf.toml";
const CACHE_NAME: &str = "cache.json";
const LOG_NAME: &str = "log.txt";

fn create_data_folder() -> Result<PathBuf, DirError> {
	let dir = dirs::data_dir()
			.ok_or_else(|| StrError("Could not find data directory".to_string()))
			.into_report()
			.attach_printable("error in create_data_folder")
			.change_context(DirError)?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir)
			.into_report()
			.attach_printable("error creating folders for create_data_folder")
			.attach_printable(format!("app_dir: {:?}", app_dir))
			.change_context(DirError)?;
	Ok(app_dir)
}

pub fn create_data_db() -> Result<PathBuf, DirError> {
	let db_path = create_data_folder()?.join(DB_NAME);
	if !db_path.exists() {
		std::fs::write(db_path.as_path(), b"")
				.into_report()
				.attach_printable("error creating data db")
				.attach_printable(format!("path: {:?}", db_path))
				.change_context(DirError)?;
		log::warn!("created data db: {:?}", db_path);
	}
	Ok(db_path)
}

fn create_conf_folder() -> Result<PathBuf, DirError> {
	let dir = dirs::preference_dir()
			.ok_or_else(|| StrError("Could not find config directory".to_string()))
			.into_report()
			.attach_printable("error in create_conf_folder")
			.change_context(DirError)?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir)
			.into_report()
			.attach_printable("error creating folders for create_data_folder")
			.attach_printable(format!("app_dir: {:?}", app_dir))
			.change_context(DirError)?;
	Ok(app_dir)
}

pub fn create_conf_toml() -> Result<PathBuf, DirError> {
	let conf_path = create_conf_folder()?.join(CONF_NAME);
	if !conf_path.exists() {
		std::fs::write(conf_path.as_path(), b"")
				.into_report()
				.attach_printable("error creating conf file")
				.attach_printable(format!("path: {:?}", conf_path))
				.change_context(DirError)?;
        log::warn!("created conf toml: {:?}", conf_path);
	}
	Ok(conf_path)
}

fn create_cache_folder() -> Result<PathBuf, DirError> {
	let dir = dirs::cache_dir()
			.ok_or_else(|| StrError("Could not find cache directory".to_string()))
			.into_report()
			.attach_printable("error in create_cache_folder")
			.change_context(DirError)?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir)
			.into_report()
			.attach_printable("error creating folders for create_cache_folder")
			.attach_printable(format!("app_dir: {:?}", app_dir))
			.change_context(DirError)?;
	Ok(app_dir)
}

pub fn create_cache_json() -> Result<PathBuf, DirError> {
	let cache_path = create_cache_folder()?.join(CACHE_NAME);
	if !cache_path.exists() {
		std::fs::write(cache_path.as_path(), b"{}")
				.into_report()
				.attach_printable("error creating cache file")
				.attach_printable(format!("path: {:?}", cache_path))
				.change_context(DirError)?;
        log::warn!("created cache json: {:?}", cache_path);
	}
	Ok(cache_path)
}

pub fn create_cache_log() -> Result<PathBuf, DirError> {
	let cache_path = create_cache_folder()?.join(LOG_NAME);
	if !cache_path.exists() {
		std::fs::write(cache_path.as_path(), b"")
				.into_report()
				.attach_printable("error creating log file")
				.attach_printable(format!("path: {:?}", cache_path))
				.change_context(DirError)?;
		log::warn!("created log file: {:?}", cache_path);
	}
	Ok(cache_path)
}

#[derive(Debug)]
pub struct DirError;

impl fmt::Display for DirError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error getting directory")
	}
}

impl std::error::Error for DirError {}