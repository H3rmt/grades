use std::fmt;

#[derive(Debug)]
pub struct DBError;

impl fmt::Display for DBError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error executing a database command")
    }
}

impl std::error::Error for DBError {}
