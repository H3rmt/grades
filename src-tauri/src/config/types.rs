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
	pub subject_default: Option<i32>,
	pub type_default: Option<i32>,
	pub period_default: Option<i32>,
}

impl Default for GradeModalDefaults {
	fn default() -> Self {
		Self {
			grade_default: 10,
			subject_default: None,
			type_default: None,
			period_default: None,
		}
	}
}

impl Display for GradeModalDefaults {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "grade_default:{} subject_default:{:?} type_default:{:?} period_default:{:?}",
		       self.grade_default, self.subject_default, self.type_default, self.period_default)
	}
}