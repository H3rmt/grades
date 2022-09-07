extern crate dotenv;

use std::env;

use dotenv::dotenv;
use sea_orm::{Database, DatabaseConnection};

pub async fn establish_connection() -> DatabaseConnection {
	dotenv().ok();
	let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
	Database::connect(database_url).await.unwrap()
}

pub fn create_grade() {

}