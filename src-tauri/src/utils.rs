use std::{
	error::Error,
	fmt::{Display, Formatter, Result},
};

#[derive(Debug)]
pub struct StrError(pub String);

impl Display for StrError {
	fn fmt(&self, f: &mut Formatter<'_>) -> Result {
		write!(f, "{}", self.0)
	}
}

impl Error for StrError {}