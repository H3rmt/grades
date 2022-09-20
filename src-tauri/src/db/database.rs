use sea_orm::{Database, DatabaseConnection};

pub async fn establish_connection() -> Result<DatabaseConnection, String> {
	let db = crate::dirs::create_data_db()?;
	let path = db.as_path().to_str().unwrap();
	
	Database::connect(format!("sqlite:{}", path)).await.map_err(|e| e.to_string())
}