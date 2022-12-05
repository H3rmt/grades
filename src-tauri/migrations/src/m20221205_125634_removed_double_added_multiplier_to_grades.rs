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
				.add_column(ColumnDef::new(Grade::Multiplier)
						.enumeration(Multiplier::Multiplier, [Multiplier::Double, Multiplier::Half, Multiplier::Default])
						.not_null()
						.default(format!("{:?}", Multiplier::Default))
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
			"ALTER TABLE `grades` DROP COLUMN `multiplier`".to_string(),
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
	Multiplier,
}

#[derive(Iden, Debug)]
#[allow(clippy::enum_variant_names)] // name for enum name in postgres
pub enum Multiplier {
	#[iden = "multiplier"]
	Multiplier,
	Default,
	Double,
	Half,
}