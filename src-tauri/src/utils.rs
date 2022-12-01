use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub struct StrError(pub String);

impl fmt::Display for StrError {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		write!(f, "{}", self.0)
	}
}

impl Error for StrError {}