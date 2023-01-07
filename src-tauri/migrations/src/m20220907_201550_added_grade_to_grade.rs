use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::alter()
				.table(Grade::Table)
				.add_column(ColumnDef::new(Grade::Grade)
						.integer()
						.not_null()
						.default(0)
				)
				.to_owned();
		
		log::info!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.alter_table(statement).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
//		let test = Table::alter()
//				.table(Grade::Table)
//				.drop_column(Grade::Grade)
//				.to_owned();
//		log::info!("SQL:{}", test.to_string(SqliteQueryBuilder));
//		manager.alter_table(
//			test
//		).await
		
		// sea-orm thinks drop table not supported on SQLite, but it is
		let sql = "ALTER TABLE `grades` DROP COLUMN `grade`";
		log::info!("SQL:{}", sql);
		
		let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
		manager.get_connection().execute(stmt).await.map(|_| ())
	}
}

#[derive(Iden)]
pub enum Grade {
	#[iden = "grades"]
	Table,
	Grade,
}

