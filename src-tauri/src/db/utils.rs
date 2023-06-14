use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::DatabaseConnection;
use sea_orm::DbErr;
use sea_orm::EntityTrait;
use crate::db::error::DBError;


pub async fn check_fk<E: EntityTrait>(db: &DatabaseConnection, select: sea_orm::Select<E>, name: &str) -> Result<(), DBError> {
    select.clone().one(db).await
    .into_report()
    .attach_printable("Error checking for fk in DB")
    .change_context(DBError)?
    .ok_or_else(|| DbErr::RecordNotFound(format!("{} not found", name)))
    .into_report()
    .change_context(DBError)?;
    Ok(())
}