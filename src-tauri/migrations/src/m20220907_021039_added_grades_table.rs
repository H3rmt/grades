use sea_orm_migration::prelude::*;

use crate::m20220906_221454_added_types_and_subjects_tables::Subject;
use crate::m20220906_221454_added_types_and_subjects_tables::Type;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::create()
				.table(Grade::Table).if_not_exists()
				.col(ColumnDef::new(Grade::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(Grade::Subject)
						.integer()
						.not_null()
				)
				.col(ColumnDef::new(Grade::Type)
						.integer()
						.not_null()
				)
				.col(ColumnDef::new(Grade::Info)
						.string()
						.not_null()
						.default("")
				)
				.foreign_key(
					ForeignKey::create()
							.from(Grade::Table, Grade::Subject)
							.to(Subject::Table, Subject::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(Grade::Table, Grade::Type)
							.to(Type::Table, Type::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.create_table(statement).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Table::drop()
				.if_exists()
				.table(Grade::Table)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		
		manager.drop_table(statement).await
	}
}

#[derive(Iden)]
pub enum Grade {
	#[iden = "grades"]
	Table,
	Id,
	Subject,
	Type,
	Info,
}
