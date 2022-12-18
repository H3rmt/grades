use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::alter()
				.table(Grade::Table)
				.add_column(ColumnDef::new(Grade::Confirmed)
						.date()
						.null()
				)
				.to_owned();
		
		let statement2 = Table::alter()
				.table(Grade::Table)
				.add_column(ColumnDef::new(Grade::Date)
						.date()
						.not_null()
						.default("")
				)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		println!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.alter_table(statement).await?;
		manager.alter_table(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let sql = "ALTER TABLE `grades` DROP COLUMN `date`;ALTER TABLE `grades` DROP COLUMN `confiremd`";
		println!("SQL:{}", sql);
		
		let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
		manager.get_connection().execute(stmt).await.map(|_| ())
	}
}


#[derive(Iden)]
pub enum Grade {
	#[iden = "grades"]
	Table,
	Date,
	Confirmed,
}