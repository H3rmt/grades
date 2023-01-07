use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

use crate::m20220929_160232_added_periods_table::Period;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Index::create()
				.unique()
				.table(Period::Table)
				.col(Period::Name)
				.name("period_name_index")
				.to_owned();
		
		log::info!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.create_index(statement).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
//		manager.drop_index(
//			Index::drop()
//					.table(Subject::Table)
//					.name("subject_name_index")
//					.to_owned()
//		).await
		
		// did just not work
		let sql = "DROP INDEX period_name_index";
		log::info!("SQL:{}", sql);
		
		let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
		manager.get_connection().execute(stmt).await.map(|_| ())
	}
}
