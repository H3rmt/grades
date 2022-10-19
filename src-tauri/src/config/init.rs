use crate::config::config::Config;

pub fn connect() -> Result<Config, String> {
	let db = crate::dirs::create_conf_toml()?;
	let path = db.as_path().to_str().unwrap();
	
	Config::connect(path).map_err(|e| e.to_string())
}