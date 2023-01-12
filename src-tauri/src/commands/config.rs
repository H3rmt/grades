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
pub async fn get_note_range_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let note_range = {
		let mutex = config.lock().await;
		let note_range = &mutex.get().note_range;
		
		serde_json::to_string(&note_range)
				.into_report()
				.attach_printable("Error serializing note_range to json")
				.attach_printable_lazy(|| format!("note_range: {}", note_range))
				.change_context(CommandError)
				.log_and_to_string()?
	};
	
	log::debug!("get_note_range_js json: {}", note_range);
	Ok(note_range)
}


#[tauri::command]
pub async fn get_grade_modal_defaults_js(config: tauri::State<'_, Mutex<Config>>) -> Result<String, String> {
	let grade_modal_defaults = {
		let mutex = config.lock().await;
		let grade_modal_defaults = &mutex.get().grade_modal_defaults;
		
		serde_json::to_string(&grade_modal_defaults)
				.into_report()
				.attach_printable("Error serializing grade_modal_defaults to json")
				.attach_printable_lazy(|| format!("grade_modal_defaults: {:?}", grade_modal_defaults))
				.change_context(CommandError)
				.log_and_to_string()?
	};
	
	log::debug!("get_grade_modal_defaults_js json: {}", grade_modal_defaults);
	Ok(grade_modal_defaults)
}

#[tauri::command]
pub async fn edit_note_range_js(config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("edit_note_range_js json: {}", json);
	
	let note_range: NoteRange = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error deserializing note_range from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	{
		let mut c = config.lock().await;
		c.set(|data| {
			data.note_range = note_range.clone();
		})
		 .attach_printable("Error setting note_range in config")
		 .change_context(CommandError)
		 .log_and_to_string()?;
	}
	
	log::info!("set note_range: {:?}", note_range);
	
	Ok(())
}

#[tauri::command]
pub async fn edit_grade_modal_defaults_js(config: tauri::State<'_, Mutex<Config>>, json: String) -> Result<(), String> {
	log::debug!("edit_grade_modal_defaults_js json: {}", json);
	
	let grade_modal_defaults: GradeModalDefaults = serde_json::from_str(&json)
			.into_report()
			.attach_printable("Error deserializing grade_modal_defaults from json")
			.attach_printable_lazy(|| format!("json: {}", json))
			.change_context(CommandError)
			.log_and_to_string()?;
	
	{
		let mut mutex = config.lock().await;
		
		let note_range = &mutex.get().note_range;
		if grade_modal_defaults.grade_default < note_range.from || grade_modal_defaults.grade_default > note_range.to {
			return Err(StrError("Grade Default out of range".to_string()))
					.into_report()
					.attach_printable_lazy(|| format!("grade_default: {}", grade_modal_defaults.grade_default))
					.attach_printable_lazy(|| format!("range: {}", note_range))
					.change_context(CommandError)
					.log_and_to_string()?;
		}
		
		mutex.set(|data| {
			data.grade_modal_defaults = grade_modal_defaults.clone();
		})
			  .attach_printable("Error setting grade_modal_defaults in config")
			  .change_context(CommandError)
			  .log_and_to_string()?;
	}
	
	log::info!("set grade_modal_defaults: {:?}", grade_modal_defaults);
	
	Ok(())
}

#[tauri::command]
pub async fn reset_grade_modal_defaults_js(config: tauri::State<'_, Mutex<Config>>) -> Result<(), String> {
	log::debug!("reset_grade_modal_defaults_js");
	
	let grade_modal_defaults = GradeModalDefaults::default();
	
	{
		let mut mutex = config.lock().await;
		mutex.set(|data| {
			data.grade_modal_defaults = grade_modal_defaults.clone();
		})
			  .attach_printable("Error resetting  grade_modal_defaults in config")
			  .change_context(CommandError)
			  .log_and_to_string()?;
	}
	
	log::info!("reset grade_modal_defaults: {:?}", grade_modal_defaults);
	
	Ok(())
}

#[tauri::command]
pub async fn reset_note_range_js(config: tauri::State<'_, Mutex<Config>>) -> Result<(), String> {
	log::debug!("reset_note_range_js");
	
	let note_range = NoteRange::default();
	
	{
		let mut mutex = config.lock().await;
		mutex.set(|data| {
			data.note_range = note_range.clone();
		})
			  .attach_printable("Error resetting note_range in config")
			  .change_context(CommandError)
			  .log_and_to_string()?;
	}
	
	log::info!("reset note_range: {:?}", note_range);
	
	Ok(())
}