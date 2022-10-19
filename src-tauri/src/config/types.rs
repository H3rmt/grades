use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Deserialize, Clone, Debug, Serialize)]
#[ts(export, export_to = "../src/entity/config/noteRange.ts")]
pub struct NoteRange {
	pub from: i8,
	pub to: i8,
}

impl Default for NoteRange {
	fn default() -> Self {
		Self {
			from: 0,
			to: 15,
		}
	}
}