use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement_temp_table = Table::create()
				.table(GradeTemp::Table)
				.if_not_exists()
				.col(ColumnDef::new(GradeTemp::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(GradeTemp::Subject)
						.integer()
						.not_null()
				)
				.col(ColumnDef::new(GradeTemp::Type)
						.integer()
						.not_null()
				)
				.col(ColumnDef::new(GradeTemp::Info)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(GradeTemp::Grade)
						.integer()
						.null()
				)
				.col(ColumnDef::new(GradeTemp::Period)
						.integer()
						.not_null()
				)
				.col(ColumnDef::new(GradeTemp::Date)
						.date()
						.null()
				)
				.col(ColumnDef::new(GradeTemp::Confirmed)
						.date()
						.null()
				)
				.col(ColumnDef::new(GradeTemp::Weight)
						.string()
						.not_null()
						.default("Normal")
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Subject)
							.to(Subject::Table, Subject::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Type)
							.to(Type::Table, Type::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Period)
							.to(Period::Table, Period::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Weight)
							.to(Weights::Table, Weights::Name)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.to_owned();
		
		let statement_move = Statement::from_string(
			manager.get_database_backend(),
			"INSERT INTO grades_temp(id, subject, type, info, grade, period, weight, date, confirmed) SELECT id, subject, type, info, grade, period, weight, date, confirmed FROM grades;".to_string(),
		);
		
		let statement_drop = Table::drop()
				.table(Grade::Table)
				.if_exists()
				.to_owned();
		
		let statement_rename  = Statement::from_string(
			manager.get_database_backend(),
			"ALTER TABLE grades_temp RENAME TO grades;".to_string(),
		);
		
		log::info!("SQL:{}", statement_temp_table.to_string(SqliteQueryBuilder));
		manager.create_table(statement_temp_table).await?;
		
		log::info!("SQL:{}", statement_move);
		manager.get_connection().execute(statement_move).await.map(|_| ())?;
		
		log::info!("SQL:{}", statement_drop.to_string(SqliteQueryBuilder));
		manager.drop_table(statement_drop).await?;
		
		log::info!("SQL:{}", statement_rename);
		manager.get_connection().execute(statement_rename).await.map(|_| ())
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement_temp_table = Table::create()
				.table(GradeTemp::Table)
				.if_not_exists()
				.col(ColumnDef::new(GradeTemp::Id)
						.integer()
						.not_null()
						.auto_increment()
						.primary_key()
				)
				.col(ColumnDef::new(GradeTemp::Subject)
						.integer()
						.not_null()
						.default(1)
				)
				.col(ColumnDef::new(GradeTemp::Type)
						.integer()
						.not_null()
						.default(1)
				)
				.col(ColumnDef::new(GradeTemp::Info)
						.string()
						.not_null()
						.default("")
				)
				.col(ColumnDef::new(GradeTemp::Grade)
						.integer()
						.null()
						.default(0)
				)
				.col(ColumnDef::new(GradeTemp::Period)
						.integer()
						.not_null()
						.default(1)
				)
				.col(ColumnDef::new(GradeTemp::Date)
						.date()
						.null()
						.default("")
				)
				.col(ColumnDef::new(GradeTemp::Confirmed)
						.date()
						.null()
				)
				.col(ColumnDef::new(GradeTemp::Weight)
						.string()
						.not_null()
						.default("Normal")
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Subject)
							.to(Subject::Table, Subject::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Type)
							.to(Type::Table, Type::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Period)
							.to(Period::Table, Period::Id)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.foreign_key(
					ForeignKey::create()
							.from(GradeTemp::Table, GradeTemp::Weight)
							.to(Weights::Table, Weights::Name)
							.on_delete(ForeignKeyAction::Restrict)
				)
				.to_owned();
		
		let statement_move = Statement::from_string(
			manager.get_database_backend(),
			"INSERT INTO grades_temp(id, subject, type, info, grade, period, weight, date, confirmed) SELECT id, subject, type, info, grade, period, weight, date, confirmed FROM grades;".to_string(),
		);
		
		let statement_drop = Table::drop()
				.table(Grade::Table)
				.if_exists()
				.to_owned();
		
		let statement_rename  = Statement::from_string(
			manager.get_database_backend(),
			"ALTER TABLE grades_temp RENAME TO grades;".to_string(),
		);
		
		log::info!("SQL:{}", statement_temp_table.to_string(SqliteQueryBuilder));
		manager.create_table(statement_temp_table).await?;
		
		log::info!("SQL:{}", statement_move);
		manager.get_connection().execute(statement_move).await.map(|_| ())?;
		
		log::info!("SQL:{}", statement_drop.to_string(SqliteQueryBuilder));
		manager.drop_table(statement_drop).await?;
		
		log::info!("SQL:{}", statement_rename);
		manager.get_connection().execute(statement_rename).await.map(|_| ())
	}
}


#[derive(Iden)]
pub enum Grade {
	#[iden = "grades"]
	Table,
}

#[derive(Iden)]
pub enum GradeTemp {
	#[iden = "grades_temp"]
	Table,
	Id,
	Subject,
	Type,
	Info,
	Grade,
	Period,
	Weight,
	Date,
	Confirmed,
}

#[derive(Iden)]
pub enum Period {
	#[iden = "periods"]
	Table,
	Id,
}

#[derive(Iden)]
pub enum Type {
	#[iden = "grade_types"]
	Table,
	Id,
}

#[derive(Iden)]
pub enum Subject {
	#[iden = "subjects"]
	Table,
	Id,
}


#[derive(Iden)]
pub enum Weights {
	#[iden = "weights"]
	Table,
	Name,
}

