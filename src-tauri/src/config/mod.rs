use error_stack::{Result, ResultExt};

use crate::config::config::ConfigError;

pub mod types;
pub mod config;

pub fn create() -> Result<config::Config, ConfigError> {
	let config_path = crate::dirs::create_conf_toml()
			.attach_printable("error getting config json path")
			.change_context(ConfigError)?;
	
	Ok(config::Config::create(config_path))
}