extern crate dirs;

use std::path::PathBuf;

const APPLICATION_NAME: &str = "grades";
const DB_NAME: &str = "db.db";
const CONF_NAME: &str = "conf.json";
const CACHE_NAME: &str = "cache.json";


fn create_data_folder() -> Result<PathBuf, String> {
	let dir_option = dirs::data_dir();
	let dir = dir_option.ok_or("Unable to get data directory".to_string())?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
	Ok(app_dir)
}

pub fn create_data_db() -> Result<PathBuf, String> {
	let db_path = create_data_folder()?.join(DB_NAME);
	if !db_path.exists() {
		std::fs::write(db_path.as_path(), b"").map_err(|e| e.to_string())?;
		println!("create data db: {:?}", db_path.as_path());
	}
	Ok(db_path)
}

fn create_conf_folder() -> Result<PathBuf, String> {
	let dir_option = dirs::preference_dir();
	let dir = dir_option.ok_or("Unable to get conf directory".to_string())?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
	Ok(app_dir)
}

pub fn create_conf_json() -> Result<PathBuf, String> {
	let conf_path = create_conf_folder()?.join(CONF_NAME);
	if !conf_path.exists() {
		std::fs::write(conf_path.as_path(), b"{}").map_err(|e| e.to_string())?;
		println!("create conf json: {:?}", conf_path.as_path());
	}
	Ok(conf_path)
}

fn create_cache_folder() -> Result<PathBuf, String> {
	let dir_option = dirs::cache_dir();
	let dir = dir_option.ok_or("Unable to get cache directory".to_string())?;
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