pub mod types;
pub mod config;

pub fn create() -> Result<config::Config, String> {
	let db = crate::dirs::create_conf_toml()?;
	let path = db.as_path().to_str().unwrap();
	
	let mut config = config::Config::create(path).map_err(|e| e.to_string())?;
	config.save().expect("Error saving config back after loading");
	Ok(config)
}