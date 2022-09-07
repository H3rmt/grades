use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_orm::{ConnectionTrait, Statement};

use crate::m20220906_221454_added_types_and_subjects_tables::{Subject, Type};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let statement = Index::create()
				.unique()
				.table(Type::Table)
				.col(Type::Name)
				.name("type_name_index")
				.to_owned();
		
		let statement2 = Index::create()
				.unique()
				.table(Subject::Table)
				.col(Subject::Name)
				.name("subject_name_index")
				.to_owned();
		
		println!("SQL:{}", statement.to_string(MysqlQueryBuilder));
		println!("SQL:{}", statement2.to_string(MysqlQueryBuilder));
		
		manager.create_index(statement).await?;
		manager.create_index(statement2).await
	}
	
	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
//		manager.drop_index(
//			Index::drop()
//					.table(Type::Table)
//					.name("type_name_index")
//					.to_owned()
//		).await?;
//
//		manager.drop_index(
//			Index::drop()
//					.table(Subject::Table)
//					.name("subject_name_index")
//					.to_owned()
//		).await
		
		// did just not work
		let sql = "DROP INDEX type_name_index;DROP INDEX subject_name_index;";
		println!("SQL:{}", sql);
		
		let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
		manager.get_connection().execute(stmt).await.map(|_| ())
	}
}

