use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult, Order};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::subjects;

pub async fn get_subjects(db: &DatabaseConnection) -> Result<Vec<subjects::Model>, DbErr> {
	subjects::Entity::find()
			.order_by(subjects::Column::Name, Order::Asc)
			.all(db).await
}

pub async fn create_subject(db: &DatabaseConnection, name: String, color: String) -> Result<(), DbErr> {
	let insert = subjects::ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(name),
		color: ActiveValue::Set(color),
	};
	
	let res = subjects::Entity::insert(insert).exec(db).await?;
	println!("created subject:{:?}", res);
	
	Ok(())
}

pub async fn edit_subject(db: &DatabaseConnection, id: i32, name: String, color: String) -> Result<(), DbErr> {
	let mut esubject: subjects::ActiveModel = subjects::Entity::find_by_id(id).one(db).await?
			.ok_or_else(|| DbErr::RecordNotFound("Subject not found".to_string()))?.into();
	
	esubject.name = ActiveValue::Set(name);
	esubject.color = ActiveValue::Set(color);
	
	let res = esubject.update(db).await?;
	println!("edited subject:{:?}", res);
	
	Ok(())
}

pub async fn delete_subject(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
	let res: DeleteResult = subjects::Entity::delete_by_id(id)
			.exec(db).await?;
	if res.rows_affected < 1 {
		return Err(DbErr::RecordNotFound("Subject not found".to_string()));
	}
	Ok(())
}