use sea_orm::{DatabaseConnection, DbErr};

use entity::subjects;

pub async fn get_periods(db: &DatabaseConnection) -> Result<Vec<subjects::Model>, DbErr> {
//	subjects::Entity::find()
//			.order_by(subjects::Column::Name, Order::Asc)
//			.all(db).await
	Ok(vec![])
}

