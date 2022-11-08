use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult, Order};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::{grade_types, grades, periods, subjects};

pub async fn get_grades(db: &DatabaseConnection) -> Result<Vec<grades::Model>, DbErr> {
	grades::Entity::find()
			.order_by(grades::Column::Grade, Order::Asc)
			.all(db).await
}

pub async fn create_grade(db: &DatabaseConnection, subject: i32, r#type: i32, info: String, grade: i32, period: i32, not_final: bool, double: bool) -> Result<(), DbErr> {
	subjects::Entity::find_by_id(subject).one(db).await?.ok_or(DbErr::RecordNotFound("Subject not found".to_string()))?;
	grade_types::Entity::find_by_id(r#type).one(db).await?.ok_or(DbErr::RecordNotFound("Type not found".to_string()))?;
	periods::Entity::find_by_id(period).one(db).await?.ok_or(DbErr::RecordNotFound("Period not found".to_string()))?;
	
	let insert = grades::ActiveModel {
		id: ActiveValue::NotSet,
		subject: ActiveValue::Set(subject),
		r#type: ActiveValue::Set(r#type),
		info: ActiveValue::Set(info),
		grade: ActiveValue::Set(grade),
		period: ActiveValue::Set(period),
		double: ActiveValue::set(double),
		not_final: ActiveValue::set(not_final),
	};
	
	let res = grades::Entity::insert(insert).exec(db).await?;
	println!("created grade:{:?}", res);
	
	Ok(())
}

pub async fn edit_grade(db: &DatabaseConnection, id: i32, subject: i32, r#type: i32, info: String, grade: i32, period: i32, not_final: bool, double: bool) -> Result<(), DbErr> {
	let mut egrade: grades::ActiveModel = grades::Entity::find_by_id(id).one(db).await?
			.ok_or_else(|| DbErr::RecordNotFound("Grade not found".to_string()))?.into();
	
	egrade.subject = ActiveValue::Set(subject);
	egrade.r#type = ActiveValue::Set(r#type);
	egrade.info = ActiveValue::Set(info);
	egrade.grade = ActiveValue::Set(grade);
	egrade.period = ActiveValue::Set(period);
	egrade.not_final = ActiveValue::Set(not_final);
	egrade.double = ActiveValue::Set(double);
	
	let res = egrade.update(db).await?;
	println!("edited grade:{:?}", res);
	
	Ok(())
}

pub async fn delete_grade(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
	let res: DeleteResult = grades::Entity::delete_by_id(id)
			.exec(db).await?;
	if res.rows_affected < 1 {
		return Err(DbErr::RecordNotFound("Grade not found".to_string()));
	}
	Ok(())
}