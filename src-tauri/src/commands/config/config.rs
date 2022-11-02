use tokio::sync::Mutex;

use crate::cache::types::Page;
use crate::config::config::Config;
use crate::config::types::NoteRange;

#[tauri::command]
pub async fn get_note_rage_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let data = {
		let c = config.lock().await;
		let note_range = &c.get().note_range;
		
		serde_json::to_string(&note_range).map_err(|e| {
			eprintln!("json no get_note_rage_js found: {}", e);
			format!("no get_note_rage_js found: {}", e)
		})?
	};
	
	println!("json get get_note_rage_js: {}", data);
	
	Ok(data)
}


#[tauri::command]
pub async fn get_grade_modal_defaults_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let data = {
		let c = config.lock().await;
		let grade_modal_defaults = &c.get().grade_modal_defaults;
		
		serde_json::to_string(&grade_modal_defaults).map_err(|e| {
			eprintln!("json no grade_modal_defaults found: {}", e);
			format!("no grade_modal_defaults found: {}", e)
		})?
	};
	
	println!("json get grade_modal_defaults: {}", data);
	
	Ok(data)
}

#[tauri::command]
pub async fn save_note_range_js(config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	println!("json set note_range: {}", json);
	
	let json: NoteRange = serde_json::from_str(&*json).map_err(|e| {
		eprintln!("json set note_range Err: {}", e);
		format!("Error serialising SetNoteRange from JSON: {}", e)
	})?;
	
	{
		let mut c = config.lock().await;
		c.get_mut().note_range = json;
		c.save().map_err(|e| {
			eprintln!("set note_range Err: {}", e);
			format!("Error setting NoteRange:{}", e)
		})?;
	}
	
	Ok(())
}
