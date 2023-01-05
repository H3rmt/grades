use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::path::PathBuf;

use error_stack::{IntoReport, ResultExt};
use serde::{Deserialize, Serialize};

use crate::cache::error::CacheError;
use crate::cache::types::Page;

#[derive(Deserialize, Serialize, Default, Debug)]
pub struct Data {
	pub page: Option<Page>,
}

#[derive(Debug)]
pub struct Cache {
	path: PathBuf,
	data: Data,
}

impl Cache {
	pub fn create(path: PathBuf) -> Self {
		let mut cache = Cache {
			path,
			data: Data::default(),
		};
		cache.load().unwrap_or_else(|err| {
			log::warn!("error loading cache: {:?}", err);
			// dont exit
		});
		log::debug!("cache-data: {:?}", cache.data);
		cache.save().unwrap_or_else(|err| {
			log::warn!("error saving cache: {:?}", err);
		});
		cache
	}
	
	fn load(&mut self) -> error_stack::Result<(), CacheError> {
		let mut file = OpenOptions::new().read(true).open(self.path.as_path())
													.into_report()
													.attach_printable("error opening cache file in read mode")
													.attach_printable_lazy(|| format!("path: {:?}", self.path.as_path()))
													.change_context(CacheError)?;
		
		let mut buffer = String::new();
		
		file.read_to_string(&mut buffer)
			 .into_report()
			 .attach_printable("error reading cache data from file")
			 .attach_printable_lazy(|| format!("buffer: {}", buffer))
			 .change_context(CacheError)?;
		
		let data: Data = serde_json::from_str(buffer.as_str())
				.into_report()
				.attach_printable("error parsing cache file from json")
				.attach_printable_lazy(|| format!("buffer: {}", buffer))
				.change_context(CacheError)?;
		
		self.data = data;
		Ok(())
	}
	
	pub fn set<F: FnOnce(&mut Data)>(&mut self, f: F) -> error_stack::Result<(), CacheError> {
		f(&mut self.data);
		self.save()
			 .attach_printable("error during saving after changes to cache")?;
		Ok(())
	}
	
	pub fn get(&self) -> &Data {
		&self.data
	}
	
	pub fn save(&mut self) -> error_stack::Result<(), CacheError> {
		let mut file = OpenOptions::new().write(true).append(false).open(self.path.as_path())
													.into_report()
													.attach_printable("error opening cache file in write mode")
													.attach_printable_lazy(|| format!("path: {:?}", self.path.as_path()))
													.change_context(CacheError)?;
		
		let data = serde_json::to_string(&self.data)
				.into_report()
				.attach_printable("error parsing cache data to json")
				.attach_printable_lazy(|| format!("data: {:?}", self.data))
				.change_context(CacheError)?;
		
		file.set_len(0)
			 .into_report()
			 .attach_printable("error clearing cache data file")
			 .attach_printable_lazy(|| format!("path: {:?}", self.path.as_path()))
			 .change_context(CacheError)?;
		
		file.write_all(data.as_bytes())
			 .into_report()
			 .attach_printable("error writing cache data to file")
			 .attach_printable_lazy(|| format!("data: {}", data))
			 .attach_printable_lazy(|| format!("path: {:?}", self.path.as_path()))
			 .change_context(CacheError)?;
		Ok(())
	}
}