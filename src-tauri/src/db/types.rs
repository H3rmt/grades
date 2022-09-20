use sea_orm::{DatabaseConnection, DbErr, Order};
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;

use entity::grade_types;

pub async fn get_types(db: &DatabaseConnection) -> Result<Vec<grade_types::Model>, DbErr> {
	grade_types::Entity::find()
			.order_by(grade_types::Column::Name, Order::Asc)
			.all(db).await
}
