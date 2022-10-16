use std::{error, fs};
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Serialize)]
pub struct Page {
	pub name: String,
}

#[derive(Deserialize, Debug, Serialize, Default)]
pub struct Data {
	pub page: Option<Page>,
}

#[derive(Debug)]
pub struct Cache {
	connection: File,
	data: Data,
}

impl Cache {
	pub fn connect(path: &str) -> Result<Self, Box<dyn error::Error>> {
		let file = OpenOptions::new().read(true).write(true).append(false).truncate(true).open(path)?;
		
		let file2 = File::create(path)?;
		
		let mut cache = Cache {
			connection: file2,
			data: Data::default(),
		};
		match cache.load() {
			Ok(_) => {}
			Err(e) => {
				eprintln!("error loading cache: {e}");
			}
		};
		println!("cache-data: {:?}", cache.data);
		Ok(cache)
	}
	
	fn load(&mut self) -> Result<(), Box<dyn error::Error>> {
		let mut buffer = String::new();
		self.connection.read_to_string(&mut buffer)?;
		
		let data: Data = serde_json::from_str(buffer.as_str())?;
		self.data = data;
		Ok(())
	}
	
	pub fn get_mut(&mut self) -> &mut Data {
		&mut self.data
	}
	
	pub fn save(&mut self) -> Result<(), Box<dyn error::Error>> {
//		self.connection.set_len(0)?;
//		fs::remove_file()
		let _ = self.connection.write(dbg!(serde_json::to_string(&self.data)?).as_bytes());
		Ok(())
	}
}