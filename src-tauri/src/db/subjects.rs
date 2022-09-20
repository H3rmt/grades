use sea_orm::{DatabaseConnection, DbErr, Order};
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::subjects;

pub async fn get_subjects(db: &DatabaseConnection) -> Result<Vec<subjects::Model>, DbErr> {
	subjects::Entity::find()
			.order_by(subjects::Column::Name, Order::Asc)
			.all(db).await
}

