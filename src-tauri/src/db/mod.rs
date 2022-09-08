extern crate dotenv;

use std::env;

use dotenv::dotenv;
use sea_orm::{ActiveValue, Database, DatabaseConnection, Order, QueryOrder};
use sea_orm::entity::prelude::*;

use entity::grade_types;
use entity::grades;
use entity::subjects;

pub async fn establish_connection() -> DatabaseConnection {
	dotenv().ok();
	let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
	Database::connect(database_url).await.unwrap()
}

pub async fn create_grade(db: &DatabaseConnection, subject: i32, r#type: i32, info: String, grade: i32) -> Result<(), DbErr> {
	let sub_model: Option<subjects::Model> = subjects::Entity::find_by_id(subject).one(db).await?;
	let sub: subjects::Model = sub_model.ok_or(DbErr::RecordNotFound("Subject not found".to_string()))?;
	
	let typ_model: Option<grade_types::Model> = grade_types::Entity::find_by_id(r#type).one(db).await?;
	let typ: grade_types::Model = typ_model.ok_or(DbErr::RecordNotFound("Type not found".to_string()))?;
	
	let insert = grades::ActiveModel {
		id: ActiveValue::NotSet,
		subject: ActiveValue::Set(sub.id),
		r#type: ActiveValue::Set(typ.id),
		info: ActiveValue::Set(info),
		grade: ActiveValue::Set(grade),
	};
	
	let res = grades::Entity::insert(insert).exec(db).await;
	println!("created grade:{:?}", res);
	
	Ok(())
}

pub async fn get_subjects(db: &DatabaseConnection) -> Result<Vec<subjects::Model>, DbErr> {
	subjects::Entity::find()
			.order_by(subjects::Column::Name, Order::Asc)
			.all(db).await
}

pub async fn get_types(db: &DatabaseConnection) -> Result<Vec<grade_types::Model>, DbErr> {
	grade_types::Entity::find()
			.order_by(grade_types::Column::Name, Order::Asc)
			.all(db).await
}
