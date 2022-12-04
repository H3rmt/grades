use error_stack::{Result, ResultExt};

use crate::cache::error::CacheError;
use crate::cache::main::Cache;

pub mod types;
pub mod main;
mod error;

pub fn create() -> Result<Cache, CacheError> {
	let cache_path = crate::dirs::create_cache_json()
			.attach_printable("error getting cache json path")
			.change_context(CacheError)?;
	
	Ok(Cache::create(cache_path))
}