use sea_orm::{ActiveValue, DatabaseConnection, DbErr, Order};
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
