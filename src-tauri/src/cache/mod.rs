use error_stack::{Result, ResultExt};

use crate::cache::cache::CacheError;

pub mod cache;
pub mod types;

pub fn create() -> Result<cache::Cache, CacheError> {
	let cachePath = crate::dirs::create_cache_json()
			.attach_printable("error getting cache json path")
			.change_context(CacheError)?;
	
	Ok(cache::Cache::create(cachePath))
}