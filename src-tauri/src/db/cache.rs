use sea_orm::{ActiveValue, DatabaseConnection, DbErr};
use sea_orm::EntityTrait;

use entity::setting;

pub async fn store_page_in_cache(db: &DatabaseConnection, page: String) -> Result<(), DbErr> {
	let insert = setting::ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::set("page".to_string()),
		value: ActiveValue::set(page),
	};
	
	let res = setting::Entity::insert(insert).exec(db).await;
	println!("set page :{:?}", res);
	
	Ok(())
}