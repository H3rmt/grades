use error_stack::{IntoReport, ResultExt};
use tokio::sync::Mutex;

use crate::{
	commands::utils::{CommandError, LogAndString},
	config::{
		main::Config,
		types::{GradeModalDefaults, NoteRange},
	},
};
use crate::utils::StrError;

#[tauri::command]
pub async fn get_note_rage_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let data = {
		let mutex = config.lock().await;
		let note_range = &mutex.get().note_range;
		
		serde_json::to_string(&note_range)
				.into_report()
				.attach_printable("Error serializing note_range to json")
				.attach_printable(format!("note_range: {}", note_range))
				.change_context(CommandError)
				.log_and_to_string()?
	};
	
	log::debug!("get_note_rage_js json: {}", data);
	Ok(data)
}


#[tauri::command]
pub async fn get_grade_modal_defaults_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let data = {
		let mutex = config.lock().await;
		let grade_modal_defaults = &mutex.get().grade_modal_defaults;
		
		serde_json::to_string(&grade_modal_defaults)
				.into_report()
				.attach_printable("Error serializing grade_modal_defaults to json")
				.attach_printable(format!("grade_modal_defaults: {:?}", grade_modal_defaults))
				.change_context(CommandError)
				.log_and_to_string()?
	};
	
	log::debug!("get_grade_modal_defaults_js json: {}", data);
	Ok(data)
}

#[tauri::command]
pub async fn save_note_range_js(config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("save_note_range_js json: {}", json);
	
	let json: NoteRange = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error deserializing note_range from json")
			.attach_printable(format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	{
		let mut c = config.lock().await;
		c.set(|data| {
			data.note_range = json;
		})
		 .attach_printable("Error setting note_range in config")
		 .change_context(CommandError)
		 .log_and_to_string()?;
	}
	
	Ok(())
}

#[tauri::command]
pub async fn save_grade_modal_defaults_js(config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("save_grade_modal_defaults_js json: {}", json);
	
	let json: GradeModalDefaults = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error deserializing grade_modal_defaults from json")
			.attach_printable(format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	{
		let mut mutex = config.lock().await;
		
		let note_range = &mutex.get().note_range;
		if json.grade_default < note_range.from || json.grade_default > note_range.to {
			return Err(StrError("Grade Default out of range".to_string()))
					.into_report()
					.attach_printable(format!("grade_default: {}", json.grade_default))
					.attach_printable(format!("range: {}", note_range))
					.change_context(CommandError)
					.log_and_to_string()?;
		}
		
		mutex.set(|data| {
			data.grade_modal_defaults = json;
		})
		 .attach_printable("Error setting grade_modal_defaults in config")
		 .change_context(CommandError)
		 .log_and_to_string()?;
	}
	
	Ok(())
}