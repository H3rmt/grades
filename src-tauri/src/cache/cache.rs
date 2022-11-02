use std::error;
use std::fs::OpenOptions;
use std::io::{Read, Write};

use serde::{Deserialize, Serialize};

use super::types::Page;

#[derive(Deserialize, Debug, Serialize, Default)]
pub struct Data {
	pub page: Option<Page>,
}

#[derive(Debug)]
pub struct Cache {
	path: String,
	data: Data,
}

impl Cache {
	pub fn connect(path: &str) -> Result<Self, Box<dyn error::Error>> {
		let mut cache = Cache {
			path: path.to_string(),
			data: Data::default(),
		};
		match cache.load() {
			Ok(_) => {}
			Err(e) => {
				eprintln!("error loading cache: {}", e);
			}
		};
		println!("cache-data: {:?}", cache.data);
		Ok(cache)
	}
	
	fn load(&mut self) -> Result<(), Box<dyn error::Error>> {
		let mut file = OpenOptions::new().read(true).open(self.path.as_str())?;
		let mut buffer = String::new();
		
		file.read_to_string(&mut buffer)?;
		
		let data: Data = serde_json::from_str(buffer.as_str())?;
		self.data = data;
		Ok(())
	}
	
	pub fn get_mut(&mut self) -> &mut Data {
		&mut self.data
	}
	
	pub fn get(&self) -> &Data {
		&self.data
	}
	
	pub fn save(&mut self) -> Result<(), Box<dyn error::Error>> {
		let mut file = OpenOptions::new().write(true).append(false).open(self.path.as_str())?;
		let _ = file.write(serde_json::to_string(&self.data)?.as_bytes());
		Ok(())
	}
}