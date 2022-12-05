use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::create()
				.table(Period::Table).if_not_exists()
				.col(ColumnDef::new(Period::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(Period::Name)
						.string()
						.not_null()
						.default(1)
				)
				.col(ColumnDef::new(Period::From)
						.date()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(Period::To)
						.date()
						.not_null()
						.default("")
				)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.create_table(statement).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::drop()
				.if_exists()
				.table(Period::Table)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.drop_table(statement).await
	}
}

#[derive(Iden)]
pub enum Period {
	#[iden = "periods"]
	Table,
	Id,
	Name,
	From,
	To,
}
