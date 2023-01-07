use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::create()
				.table(Weights::Table).if_not_exists()
				.col(ColumnDef::new(Weights::Name)
						.string()
						.not_null()
						.primary_key()
				)
				.col(ColumnDef::new(Weights::Value)
						.string()
						.not_null()
				)
				.to_owned();
		
		let statement2 = Query::insert()
				.into_table(Weights::Table)
				.columns([Weights::Name, Weights::Value])
				.values(["Normal".into(), "{}*1".into()]).expect("Failed to insert normal weight")
				.values(["Double".into(), "{}*2".into()]).expect("Failed to insert double weight")
				.values(["Half".into(), "{}/2".into()]).expect("Failed to insert half weight")
				.values(["Ignore".into(), "{}*0".into()]).expect("Failed to insert ignore weight")
				.to_owned();
		
		log::info!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		log::info!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.create_table(statement).await?;
		manager.exec_stmt(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::drop()
				.if_exists()
				.table(Weights::Table)
				.to_owned();
		
		log::info!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.drop_table(statement).await
	}
}

#[derive(Iden)]
pub enum Weights {
	#[iden = "weights"]
	Table,
	Name,
	Value,
}
