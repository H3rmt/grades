pub mod cache;
pub mod types;

pub fn create() -> Result<cache::Cache, String> {
	let db = crate::dirs::create_cache_json()?;
	let path = db.as_path().to_str().unwrap();
	
	cache::Cache::connect(path).map_err(|e| e.to_string())
}