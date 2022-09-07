use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::create()
				.table(Type::Table).if_not_exists()
				.col(ColumnDef::new(Type::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(Type::Name)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(Type::Color)
						.string()
						.not_null()
						.default("grey")
				)
				.to_owned();
		
		let statement2 = Table::create()
				.table(Subject::Table).if_not_exists()
				.col(ColumnDef::new(Subject::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(Subject::Name)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(Subject::Color)
						.string()
						.not_null()
						.default("grey")
				)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(MysqlQueryBuilder));
		println!("SQL:{}", statement2.to_string(MysqlQueryBuilder));
		
		manager.create_table(statement).await?;
		manager.create_table(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::drop()
				.table(Type::Table)
				.to_owned();
		
		let statement2 = Table::drop()
				.table(Subject::Table)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(MysqlQueryBuilder));
		println!("SQL:{}", statement2.to_string(MysqlQueryBuilder));
		
		manager.drop_table(statement).await?;
		manager.drop_table(statement2).await
	}
}

#[derive(Iden)]
pub enum Type {
	#[iden = "grade_types"]
	Table,
	Id,
	Name,
	Color,
}

#[derive(Iden)]
pub enum Subject {
	#[iden = "subjects"]
	Table,
	Id,
	Name,
	Color,
}
