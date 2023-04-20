use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{Database, DatabaseConnection};

use crate::db::error::DBError;

pub async fn establish_connection() -> Result<DatabaseConnection, DBError> {
	let db = crate::dirs::create_data_db()
			.attach_printable("error getting path to db")
			.change_context(DBError)?;
	
	Database::connect(format!("sqlite:{}", db.display()))
			.await
			.into_report()
			.attach_printable("error connecting to db")
			.change_context(DBError)
}