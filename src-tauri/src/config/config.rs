use std::error;
use std::fs::OpenOptions;
use std::io::{Read, Write};

use serde::{Deserialize, Serialize};

use crate::config::types::{GradeModalDefaults, NoteRange};

#[derive(Deserialize, Debug, Serialize, Default)]
pub struct Data {
	pub note_range: NoteRange,
	pub grade_modal_defaults: GradeModalDefaults,
}

#[derive(Debug)]
pub struct Config {
	path: String,
	data: Data,
}

impl Config {
	pub fn create(path: &str) -> Result<Self, Box<dyn error::Error>> {
		let mut config = Config {
			path: path.to_string(),
			data: Data::default(),
		};
		match config.load() {
			Ok(_) => {}
			Err(e) => {
				eprintln!("error loading config: {}", e);
			}
		};
		println!("config-data: {:?}", config.data);
		Ok(config)
	}
	
	fn load(&mut self) -> Result<(), Box<dyn error::Error>> {
		let mut file = OpenOptions::new().read(true).open(self.path.as_str())?;
		let mut buffer = String::new();
		
		file.read_to_string(&mut buffer)?;
		
		let data: Data = toml::from_str(buffer.as_str())?;
		self.data = data;
		Ok(())
	}
	
	fn get_mut(&mut self) -> &mut Data {
		&mut self.data
	}
	
	pub fn set<F: FnOnce(&mut Data)>(&mut self, f: F) -> Result<(), Box<dyn error::Error>> {
		f(self.get_mut());
		self.save()?;
		Ok(())
	}
	
	pub fn get(&self) -> &Data {
		&self.data
	}
	
	pub fn save(&mut self) -> Result<(), Box<dyn error::Error>> {
		let mut file = OpenOptions::new().write(true).append(false).open(self.path.as_str())?;
		let _ = file.write(toml::to_string(&self.data)?.as_bytes());
		Ok(())
	}
}