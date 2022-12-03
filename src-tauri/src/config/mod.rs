use error_stack::{Result, ResultExt};
use crate::config::error::ConfigError;
use crate::config::main::Config;

pub mod types;
pub mod main;
mod error;

pub fn create() -> Result<Config, ConfigError> {
	let config_path = crate::dirs::create_conf_toml()
			.attach_printable("error getting config json path")
			.change_context(ConfigError)?;
	
	Ok(Config::create(config_path))
}