use sea_orm::{DatabaseConnection, DbErr, Order};
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::periods;

pub async fn get_periods(db: &DatabaseConnection) -> Result<Vec<periods::Model>, DbErr> {
	periods::Entity::find()
			.order_by(periods::Column::Name, Order::Asc)
			.all(db).await
}

