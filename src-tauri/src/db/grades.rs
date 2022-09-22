use sea_orm::{ActiveValue, DatabaseConnection, DbErr};
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::{grade_types, grades, subjects};

pub async fn get_grades(db: &DatabaseConnection) -> Result<Vec<grades::Model>, DbErr> {
	grades::Entity::find()
			.all(db).await
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

