use core::fmt;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Delete {
	pub id: i32,
}

#[derive(Debug)]
pub struct CommandError;

impl fmt::Display for CommandError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error executing rust command")
	}
}

impl std::error::Error for CommandError {}