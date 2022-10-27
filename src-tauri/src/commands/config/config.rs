use tokio::sync::Mutex;
use crate::config::config::Config;

#[tauri::command]
pub async fn get_note_rage_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let data = {
		let mut c = config.lock().await;
		let note_range = &c.get_mut().note_range;
		
		serde_json::to_string(&note_range).map_err(|e| {
			eprintln!("json no get_note_rage_js found: {e}");
			format!("no get_note_rage_js found: {}", e)
		})?
	};
	
	println!("json get get_note_rage_js: {}", data);
	
	Ok(data)
}


#[tauri::command]
pub async fn get_grade_modal_defaults(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let data = {
		let mut c = config.lock().await;
		let grade_modal_defaults = &c.get_mut().grade_modal_defaults;
		
		serde_json::to_string(&grade_modal_defaults).map_err(|e| {
			eprintln!("json no grade_modal_defaults found: {e}");
			format!("no grade_modal_defaults found: {}", e)
		})?
	};
	
	println!("json get grade_modal_defaults: {}", data);
	
	Ok(data)
}