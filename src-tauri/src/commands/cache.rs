use error_stack::{IntoReport, ResultExt};
use tokio::sync::Mutex;

use crate::{
	cache::{
		main::Cache,
		types::Page,
	},
	commands::utils::{CommandError, LogAndString},
};
use crate::cache::types::Version;

#[tauri::command]
pub async fn get_page_from_cache_js(cache: tauri::State<'_, Mutex<Cache>>) -> Result<Option<String>, String> {
	let data = {
		let mutex = cache.lock().await;
		let page = match &mutex.get().page {
			Some(page) => page,
			None => {
				log::debug!("no site in cache");
				return Ok(None);
			}
		};
		
		serde_json::to_string(&page)
				.into_report()
				.attach_printable("Error serializing Page to json")
				.attach_printable_lazy(|| format!("page: {}", page))
				.change_context(CommandError)
				.log_and_to_string()?
	};
	
	log::debug!("get_page_from_cache_js json: {}", data);
	Ok(Some(data))
}

#[tauri::command]
pub async fn edit_page_in_cache_js(cache: tauri::State<'_, Mutex<Cache>>, json: String) -> Result<(), String> {
	log::debug!("edit_page_in_cache_js json: {}", json);
	
	let json: Page = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error deserializing Page from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	{
		let mut c = cache.lock().await;
		c.set(|data| {
			data.page = Some(json);
		})
		 .attach_printable("Error setting page in cache")
		 .change_context(CommandError)
		 .log_and_to_string()?;
	}
	
	Ok(())
}

#[tauri::command]
pub async fn edit_skip_version_in_cache_js(cache: tauri::State<'_, Mutex<Cache>>, json: String) -> Result<(), String> {
	log::debug!("edit_skip_version_js json: {}", json);
	
	let json: Version = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error deserializing Version from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	{
		let mut c = cache.lock().await;
		c.set(|data| {
			data.version = Some(json);
		})
		 .attach_printable("Error setting skipVersion in cache")
		 .change_context(CommandError)
		 .log_and_to_string()?;
	}
	
	Ok(())
}


#[tauri::command]
pub async fn get_skip_version_in_cache_js(cache: tauri::State<'_, Mutex<Cache>>) -> Result<Option<String>, String>  {
	let data = {
		let mutex = cache.lock().await;
		let page = match &mutex.get().version {
			Some(version) => version,
			None => {
				log::debug!("no skipVersion in cache");
				return Ok(None);
			}
		};
		
		serde_json::to_string(&page)
				.into_report()
				.attach_printable("Error serializing Version to json")
				.attach_printable_lazy(|| format!("page: {}", page))
				.change_context(CommandError)
				.log_and_to_string()?
	};
	
	log::debug!("get_skip_version_js json: {}", data);
	Ok(Some(data))
}