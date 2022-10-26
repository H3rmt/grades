use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult, Order};
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::{grade_types, grades, periods, subjects};

pub async fn get_grades(db: &DatabaseConnection) -> Result<Vec<grades::Model>, DbErr> {
	grades::Entity::find()
			.order_by(grades::Column::Grade, Order::Asc)
			.all(db).await
}

pub async fn create_grade(db: &DatabaseConnection, subject: i32, r#type: i32, info: String, grade: i32, period: i32, not_final: bool, double: bool) -> Result<(), DbErr> {
	let sub_model: Option<subjects::Model> = subjects::Entity::find_by_id(subject).one(db).await?;
	let sub: subjects::Model = sub_model.ok_or(DbErr::RecordNotFound("Subject not found".to_string()))?;
	
	let typ_model: Option<grade_types::Model> = grade_types::Entity::find_by_id(r#type).one(db).await?;
	let typ: grade_types::Model = typ_model.ok_or(DbErr::RecordNotFound("Type not found".to_string()))?;
	
	let per_model: Option<periods::Model> = periods::Entity::find_by_id(period).one(db).await?;
	let per: periods::Model = per_model.ok_or(DbErr::RecordNotFound("Period not found".to_string()))?;
	
	
	let insert = grades::ActiveModel {
		id: ActiveValue::NotSet,
		subject: ActiveValue::Set(sub.id),
		r#type: ActiveValue::Set(typ.id),
		info: ActiveValue::Set(info),
		grade: ActiveValue::Set(grade),
		period: ActiveValue::Set(per.id),
		double: ActiveValue::set(double),
		not_final: ActiveValue::set(not_final),
	};
	
	let res = grades::Entity::insert(insert).exec(db).await;
	println!("created grade:{:?}", res);
	
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