extern crate dirs;

use std::fmt;
use std::path::PathBuf;

use error_stack::{IntoReport, ResultExt};
use serde::{Deserialize, Serialize};
use serde::de::Unexpected::Str;

const APPLICATION_NAME: &str = "grades";
const DB_NAME: &str = "db.db";
const CONF_NAME: &str = "conf.toml";
const CACHE_NAME: &str = "cache.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StrError(String);

impl fmt::Display for StrError {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		write!(f, "{}", self.0)
	}
}

impl std::error::Error for StrError {}

fn create_data_folder() -> error_stack::Result<PathBuf, DirError> {
	let dir = dirs::data_dir()
			.ok_or(StrError("Could not find data directory".to_string()))
			.into_report()
			.attach_printable("error in create_data_folder")
			.change_context(DirError)?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir)
			.into_report()
			.attach_printable("error creating folders for create_data_folder")
			.attach_printable_lazy(|| format!("app_dir: {:?}", app_dir))
			.change_context(DirError)?;
	Ok(app_dir)
}

pub fn create_data_db() -> error_stack::Result<PathBuf, DirError> {
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

fn create_conf_folder() -> Result<PathBuf, String> {
	let dir_option = dirs::preference_dir();
	let dir = dir_option.ok_or_else(|| "Unable to get conf directory".to_string())?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
	Ok(app_dir)
}

pub fn create_conf_toml() -> Result<PathBuf, String> {
	let conf_path = create_conf_folder()?.join(CONF_NAME);
	if !conf_path.exists() {
		std::fs::write(conf_path.as_path(), b"{}").map_err(|e| e.to_string())?;
		println!("create conf toml: {:?}", conf_path.as_path());
	}
	Ok(conf_path)
}

fn create_cache_folder() -> Result<PathBuf, String> {
	let dir_option = dirs::cache_dir();
	let dir = dir_option.ok_or_else(|| "Unable to get cache directory".to_string())?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
	Ok(app_dir)
}

pub fn create_cache_json() -> Result<PathBuf, String> {
	let cache_path = create_cache_folder()?.join(CACHE_NAME);
	if !cache_path.exists() {
		std::fs::write(cache_path.as_path(), b"{}").map_err(|e| e.to_string())?;
		println!("create cache json: {:?}", cache_path.as_path());
	}
	Ok(cache_path)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DirError;

impl fmt::Display for DirError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error getting sys directory")
	}
}

impl std::error::Error for DirError {}