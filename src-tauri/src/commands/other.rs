use core::fmt;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Delete {
	pub id: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError;

impl fmt::Display for CommandError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error executing rust call from js")
	}
}

impl std::error::Error for CommandError {}