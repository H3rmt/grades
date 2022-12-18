use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::create()
				.table(Setting::Table).if_not_exists()
				.col(ColumnDef::new(Setting::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(Setting::Name)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(Setting::Value)
						.string()
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
				.table(Setting::Table)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.drop_table(statement).await
	}
}


#[derive(Iden)]
pub enum Setting {
	#[iden = "setting"]
	Table,
	Id,
	Name,
	Value,
}
