use std::{error, fmt};
use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub struct ConfigError;

impl Display for ConfigError {
	fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
		write!(f, "ConfigError")
	}
}

impl error::Error for ConfigError {}