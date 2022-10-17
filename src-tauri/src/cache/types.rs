use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Deserialize, Clone, Debug, Serialize)]
#[ts(export, export_to = "../src/entity/cache/page.ts")]
pub struct Page {
	pub name: String,
}