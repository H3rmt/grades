use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Deserialize, Serialize, Debug)]
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

#[derive(TS, Deserialize, Serialize, Debug)]
#[ts(export, export_to = "../src/entity/config/gradeModalDefaults.ts")]
pub struct GradeModalDefaults {
	pub grade_default: i8,
	pub subject_default: String,
	pub type_default: String,
	pub period_default: String,
	pub info_default: String,
	pub not_final_default: bool,
	pub double_default: bool,
}

impl Default for GradeModalDefaults {
	fn default() -> Self {
		Self {
			grade_default: 10,
			subject_default: "".to_string(),
			type_default: "".to_string(),
			period_default: "".to_string(),
			info_default: "".to_string(),
			not_final_default: false,
			double_default: false,
		}
	}
}
