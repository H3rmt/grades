use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult, Order};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::grade_types;

pub async fn get_types(db: &DatabaseConnection) -> Result<Vec<grade_types::Model>, DbErr> {
	grade_types::Entity::find()
			.order_by(grade_types::Column::Name, Order::Asc)
			.all(db).await
}


pub async fn create_type(db: &DatabaseConnection, name: String, color: String) -> Result<(), DbErr> {
	let insert = grade_types::ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(name),
		color: ActiveValue::Set(color),
	};
	
	let res = grade_types::Entity::insert(insert).exec(db).await?;
	println!("created type:{:?}", res);
	
	Ok(())
}

pub async fn edit_type(db: &DatabaseConnection, id: i32, name: String, color: String) -> Result<(), DbErr> {
	let mut etype: grade_types::ActiveModel = grade_types::Entity::find_by_id(id).one(db).await?
			.ok_or_else(|| DbErr::RecordNotFound("Type not found".to_string()))?.into();
	
	etype.name = ActiveValue::Set(name);
	etype.color = ActiveValue::Set(color);
	
	let res = etype.update(db).await?;
	println!("edited type:{:?}", res);
	
	Ok(())
}

pub async fn delete_type(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
	let res: DeleteResult = grade_types::Entity::delete_by_id(id)
			.exec(db).await?;
	if res.rows_affected < 1 {
		return Err(DbErr::RecordNotFound("Type not found".to_string()));
	}
	Ok(())
}