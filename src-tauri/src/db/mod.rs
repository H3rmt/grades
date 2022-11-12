use std::fmt;
use error_stack::{IntoReport, ResultExt, Result};
use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult};

use sea_orm::EntityTrait;

pub mod database;
pub mod types;
pub mod subjects;
pub mod grades;
pub mod periods;

#[derive(Debug)]
pub struct DBError;

impl fmt::Display for DBError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error executing a database command")
	}
}

impl std::error::Error for DBError {}

pub async fn check_fk<E: EntityTrait>(db: &DatabaseConnection, select: sea_orm::Select<E>, name: &str) -> Result<(), DBError> {
	select.one(db).await
			.into_report()
			.attach_printable_lazy(|| "Error checking for fk in DB")
			.change_context(DBError)?
			.ok_or_else(|| DbErr::RecordNotFound(format!("{} not found", name)))
			.into_report()
			.change_context(DBError)?;
	
	Ok(())
}