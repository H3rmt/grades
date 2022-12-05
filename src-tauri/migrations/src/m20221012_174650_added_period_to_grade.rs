use sea_orm_migration::prelude::*;

use crate::m20220906_221454_added_types_and_subjects_tables::{Subject, Type};
use crate::m20220929_160232_added_periods_table::Period;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
//		let statement = Table::alter()
//				.table(Grade::Table)
//				.add_column(ColumnDef::new(Grade::Period)
//						.integer()
//						.not_null()
//				)
//				.add_foreign_key(
//					TableForeignKey::new()
//							.from_tbl(Grade::Table)
//							.from_col(Grade::Period)
//							.to_tbl(Period::Table)
//							.to_col(Period::Id)
//							.on_delete(ForeignKeyAction::Restrict)
//				)
//				.to_owned();
//
//		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
//
//		manager.alter_table(statement).await
		
		// SQLITE add_foreign_key doesnt work
		
		let statement = Table::drop()
				.if_exists()
				.table(Grade::Table)
				.to_owned();
		
		let statement2 = Table::create()
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
						.default(1)
				)
				.col(ColumnDef::new(Grade::Type)
						.integer()
						.not_null()
						.default(1)
				)
				.col(ColumnDef::new(Grade::Info)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(Grade::Grade)
						.integer()
						.not_null()
						.default(0)
				)
				.col(ColumnDef::new(Grade::Period)
						.integer()
						.not_null()
						.default(1)
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
				.foreign_key(
					ForeignKey::create()
							.from(Grade::Table, Grade::Period)
							.to(Period::Table, Period::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.to_owned();
		
		println!("SQL:{}", statement.to_string(SqliteQueryBuilder));
		println!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.drop_table(statement).await?;
		manager.create_table(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
//		let sql = "ALTER TABLE `grades` DROP COLUMN `period`";
//		println!("SQL:{}", sql);
//
//		let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
//		manager.get_connection().execute(stmt).await.map(|_| ())
		
		let statement = Table::drop()
				.if_exists()
				.table(Grade::Table)
				.to_owned();
		
		let statement2 = Table::create()
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
						.default(1)
				)
				.col(ColumnDef::new(Grade::Type)
						.integer()
						.not_null()
						.default(1)
				)
				.col(ColumnDef::new(Grade::Info)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(Grade::Grade)
						.integer()
						.not_null()
						.default(0)
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
		println!("SQL:{}", statement2.to_string(SqliteQueryBuilder));
		
		manager.drop_table(statement).await?;
		manager.create_table(statement2).await
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
	Grade,
	Period,
}