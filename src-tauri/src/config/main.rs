use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::path::PathBuf;

use error_stack::{IntoReport, Result, ResultExt};
use serde::{Deserialize, Serialize};

use crate::config::error::ConfigError;
use crate::config::types::{GradeModalDefaults, NoteRange};

#[derive(Deserialize, Serialize, Default, Debug)]
pub struct Data {
	pub note_range: NoteRange,
	pub grade_modal_defaults: GradeModalDefaults,
}

#[derive(Default, Debug)]
pub struct Config {
	path: PathBuf,
	data: Data,
}

impl Config {
	pub fn create(path: PathBuf) -> Self {
		let mut config = Config {
			path,
			data: Default::default(),
		};
		config.load().unwrap_or_else(|err| {
			log::warn!("error loading config: {:?}", err);
			// dont exit
		});
		log::debug!("config-data: {:?}", config.data);
		config.save().unwrap_or_else(|err| {
			log::warn!("error saving config: {:?}", err);
		});
		config
	}
	
	fn load(&mut self) -> Result<(), ConfigError> {
		let mut file = OpenOptions::new().read(true).open(self.path.as_path())
		                                 .into_report()
		                                 .attach_printable("error opening config file in read mode")
		                                 .attach_printable(format!("path: {:?}", self.path.as_path()))
		                                 .change_context(ConfigError)?;
		
		let mut buffer = String::new();
		
		file.read_to_string(&mut buffer)
		    .into_report()
		    .attach_printable("error reading config data from file")
		    .attach_printable_lazy(|| format!("buffer: {}", buffer))
		    .change_context(ConfigError)?;
		
		let data: Data = toml::from_str(buffer.as_str())
				.into_report()
				.attach_printable("error parsing config file from toml")
				.attach_printable_lazy(|| format!("buffer: {}", buffer))
				.change_context(ConfigError)?;
		
		self.data = data;
		Ok(())
	}
	
	pub fn set<F: FnOnce(&mut Data)>(&mut self, f: F) -> Result<(), ConfigError> {
		f(&mut self.data);
		self.save()
		    .attach_printable("error during saving after changes to config")?;
		Ok(())
	}
	
	pub fn get(&self) -> &Data {
		&self.data
	}
	
	pub fn save(&mut self) -> Result<(), ConfigError> {
		let mut file = OpenOptions::new().write(true).append(false).open(self.path.as_path())
		                                 .into_report()
		                                 .attach_printable("error opening config file in write mode")
		                                 .attach_printable(format!("path: {:?}", self.path.as_path()))
		                                 .change_context(ConfigError)?;
		
		let data = toml::to_string(&self.data)
				.into_report()
				.attach_printable("error parsing config data to toml")
				.attach_printable_lazy(|| format!("data: {:?}", self.data))
				.change_context(ConfigError)?;
		
		file.set_len(0)
		    .into_report()
		    .attach_printable("error clearing config data file")
		    .attach_printable_lazy(|| format!("path: {:?}", self.path.as_path()))
		    .change_context(ConfigError)?;
		
		file.write_all(data.as_bytes())
		    .into_report()
		    .attach_printable("error writing config data to file")
		    .attach_printable_lazy(|| format!("data: {}", data))
		    .attach_printable_lazy(|| format!("path: {:?}", self.path.as_path()))
		    .change_context(ConfigError)?;
		Ok(())
	}
}