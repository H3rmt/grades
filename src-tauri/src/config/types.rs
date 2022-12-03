use std::fmt::Display;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Deserialize, Serialize, Debug)]
#[ts(export, export_to = "../src/entity/config/noteRange.ts")]
pub struct NoteRange {
	pub from: i32,
	pub to: i32,
}

impl Default for NoteRange {
	fn default() -> Self {
		Self {
			from: 0,
			to: 15,
		}
	}
}

impl Display for NoteRange {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "{} - {}", self.from, self.to)
	}
}

#[derive(TS, Deserialize, Serialize, Debug)]
#[ts(export, export_to = "../src/entity/config/gradeModalDefaults.ts")]
pub struct GradeModalDefaults {
	pub grade_default: i32,
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

impl Display for GradeModalDefaults {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "grade_default:{} subject_default:{} type_default:{} period_default:{} info_default:{} not_final_default:{} double_default:{}",
		       self.grade_default, self.subject_default, self.type_default, self.period_default, self.info_default, self.not_final_default, self.double_default)
	}
}