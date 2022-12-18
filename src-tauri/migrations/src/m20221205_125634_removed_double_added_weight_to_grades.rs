use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::alter()
				.table(Grade::Table)
				.drop_column(Grade::Double)
				.to_owned();
		
		let statement2 = Table::alter()
				.table(Grade::Table)
				.add_column(ColumnDef::new(Grade::Weight)
						.enumeration(Weight::Weight, [Weight::Double, Weight::Half, Weight::Default])
						.not_null()
						.default(format!("{:?}", Weight::Default))
				)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		println!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.alter_table(statement).await?;
		manager.alter_table(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Statement::from_string(
			manager.get_database_backend(),
			"ALTER TABLE `grades` DROP COLUMN `weight`".to_string(),
		);
		
		let statement2 = Table::alter()
				.table(Grade::Table)
				.add_column(ColumnDef::new(Grade::Double)
						.boolean()
						.not_null()
						.default(false)
				)
				.to_owned();
		
		println!("SQL:{}", statement);
		println!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.get_connection().execute(statement).await.map(|_| ())?;
		manager.alter_table(statement2).await
	}
}


#[derive(Iden)]
pub enum Grade {
	#[iden = "grades"]
	Table,
	Double,
	Weight,
}

#[derive(Iden, Debug)]
#[allow(clippy::enum_variant_names)]
pub enum Weight {
	#[iden = "weight"]  // name for enum name in postgres
	Weight,
	Default,
	Double,
	Half,
}