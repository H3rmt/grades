use crate::cache::cache::Cache;

pub fn connect() -> Result<Cache, String> {
	let db = crate::dirs::create_cache_json()?;
	let path = db.as_path().to_str().unwrap();
	
	Cache::connect(path).map_err(|e| e.to_string())
}