use tokio::sync::Mutex;

use crate::Cache;
use crate::cache::types::Page;

#[tauri::command]
pub async fn store_page_in_cache_js(cache: tauri::State<'_, Mutex<Cache>>, json: String) -> Result<(), String> {
	println!("json set page: {}", json);
	
	let json: Page = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json set page Err: {}", e);
		format!("Error serialising SetPage from JSON: {}", e)
	})?;
	
	{
		let mut c = cache.lock().await;
		c.get_mut().page = Some(json);
		c.save().map_err(|e| {
			eprintln!("set page Err: {}", e);
			format!("Error setting Page:{}", e)
		})?;
	}
	
	Ok(())
}


#[tauri::command]
pub async fn get_page_from_cache_js(cache: tauri::State<'_, Mutex<Cache>>) -> Result<String, String> {
	let data = {
		let c = cache.lock().await;
		let page = c.get().page.as_ref().ok_or_else(|| {
			eprintln!("no site in cache");
			"no site in cache".to_string()
		})?;
		
		serde_json::to_string(&page).map_err(|e| {
			eprintln!("json get periods Err: {}", e);
			format!("Error serialising Periods to JSON: {}", e)
		})?
	};
	
	println!("json get periods: {}", data);
	
	Ok(data)
}

