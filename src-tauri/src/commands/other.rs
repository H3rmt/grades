use core::fmt;
use std::ops::Deref;

use error_stack::FrameKind;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Delete {
	pub id: i32,
}

#[derive(Debug)]
pub struct CommandError;

impl fmt::Display for CommandError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error executing command")
	}
}

impl std::error::Error for CommandError {}


pub trait LogAndString<T> {
	fn log_and_to_string(self) -> Result<T, String>;
}


impl<T, C: fmt::Display + Send + Sync + 'static> LogAndString<T> for error_stack::Result<T, C> {
	fn log_and_to_string(self) -> Result<T, String> {
		self.map_err(|e| {
			log::error!("{:?}", e);
			format!("{} ({})", e, match e.frames().last().unwrap().kind() {
				FrameKind::Context(context) => { context.to_string() }
				FrameKind::Attachment(_) => { "".to_string() }
			})
		})
	}
}