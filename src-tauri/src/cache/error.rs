use std::{error, fmt};
use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub struct CacheError;

impl Display for CacheError {
	fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
		write!(f, "CacheError")
	}
}

impl error::Error for CacheError {}