use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult, Order};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::{grade_types, grades, periods, subjects};

pub async fn get_periods(db: &DatabaseConnection) -> Result<Vec<periods::Model>, DbErr> {
	periods::Entity::find()
			.order_by(periods::Column::Name, Order::Asc)
			.all(db).await
}


pub async fn create_period(db: &DatabaseConnection, name: String, from: String, to: String) -> Result<(), DbErr> {
	let insert = periods::ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(name),
		from: ActiveValue::Set(from),
		to: ActiveValue::Set(to),
	};
	
	let res = periods::Entity::insert(insert).exec(db).await;
	println!("created period:{:?}", res);
	
	Ok(())
}

pub async fn delete_period(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
	let res: DeleteResult = periods::Entity::delete_by_id(id)
			.exec(db).await?;
	if res.rows_affected < 1 {
		return Err(DbErr::RecordNotFound("Period not found".to_string()));
	}
	Ok(())
}

pub async fn edit_period(db: &DatabaseConnection, id: i32, name: String, from: String, to: String) -> Result<(), DbErr> {
	let mut period: periods::ActiveModel = periods::Entity::find_by_id(id).one(db).await?
			.ok_or_else(|| DbErr::RecordNotFound("Period not found".to_string()))?.into();
	
	period.name = ActiveValue::Set(name);
	period.from = ActiveValue::Set(from);
	period.to = ActiveValue::Set(to);
	
	let res = period.update(db).await?;
	println!("edited period:{:?}", res);
	
	Ok(())
}