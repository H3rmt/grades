extern crate dirs;

use std::path::PathBuf;

const APPLICATION_NAME: &str = "grades";
const DB_NAME: &str = "db.db";


pub fn create_folder() -> Result<PathBuf, String> {
	let dir_option = dirs::data_dir();
	let dir = dir_option.ok_or("Unable to get data directory".to_string())?;
	let app_dir = dir.join(APPLICATION_NAME);
	std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
	Ok(app_dir)
}

pub fn create_db() -> Result<PathBuf, String> {
	let db_path = create_folder()?.join(DB_NAME);
	if !db_path.exists() {
		std::fs::write(db_path.as_path(), b"").map_err(|e| e.to_string())?;
	}
	Ok(db_path)
}