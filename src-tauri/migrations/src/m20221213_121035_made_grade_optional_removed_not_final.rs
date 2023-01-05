use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
//		let statement = Table::alter()
//				.table(Grade::Table)
//				.modify_column(ColumnDef::new(Grade::Grade)
//						.null()
//				)
//				.to_owned();
		
		// SQL:ALTER TABLE `grades` MODIFY COLUMN `grade` NULL
		
		let statement = Statement::from_string(
			manager.get_database_backend(),
			"ALTER TABLE `grades` DROP COLUMN `grade`;ALTER TABLE `grades` ADD `grade` integer NULL".to_string(),
		);
		
		let statement2 = Table::alter()
				.table(Grade::Table)
				.drop_column(Grade::NotFinal)
				.to_owned();
		
		log::info!("SQL:{}", statement);
		log::info!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.get_connection().execute(statement).await.map(|_| ())?;
		manager.alter_table(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::alter()
				.table(Grade::Table)
				.add_column(ColumnDef::new(Grade::NotFinal)
						.boolean()
						.not_null()
						.default(false)
				)
				.to_owned();
		
		let statement2 = Statement::from_string(
			manager.get_database_backend(),
			"ALTER TABLE `grades` DROP COLUMN `grade`;ALTER TABLE `grades` ADD `grade` integer NOT NULL default 0".to_string(),
		);
		
		log::info!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		log::info!("SQL:{}", statement2);
		
		manager.alter_table(statement).await?;
		manager.get_connection().execute(statement2).await.map(|_| ())
	}
}

#[derive(Iden)]
pub enum Grade {
	#[iden = "grades"]
	Table,
//	Grade,
	NotFinal,
}