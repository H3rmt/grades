use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;

use entity::grade_types::{ActiveModel, Entity, Model};
use crate::commands::other::Delete;

use crate::db::DBError;

pub async fn get_types(db: &DatabaseConnection) -> Result<Vec<Model>, DBError> {
	Entity::find()
			.all(db).await
			.into_report()
			.attach_printable_lazy(|| "Error loading types from DB")
			.change_context(DBError)
}


pub async fn create_type(db: &DatabaseConnection, modal: Model) -> Result<(), DBError> {
	let insert = ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(modal.name.clone()),
		color: ActiveValue::Set(modal.color.clone()),
	};
	
	let res = Entity::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error creating type in DB")
			.attach_printable_lazy(|| format!("insert:{:#?} name:{} color:{}", insert, modal.name, modal.color))
			.change_context(DBError)?;
	
	println!("created type:{:?}", res);
	
	Ok(())
}

pub async fn edit_type(db: &DatabaseConnection, modal: Model) -> Result<(), DBError> {
	let edit: Option<Model> = Entity::find_by_id(modal.id)
			.one(db).await
			.into_report()
			.attach_printable_lazy(|| "Error finding type in DB")
			.attach_printable_lazy(|| format!("id:{}", modal.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveModel = edit
			.ok_or_else(|| DbErr::RecordNotFound("Type not found".to_string()))
			.into_report()
			.attach_printable_lazy(|| "Error finding type in DB")
			.attach_printable_lazy(|| format!("id:{}", modal.id))
			.change_context(DBError)?
			.into();
	
	edit.name = ActiveValue::Set(modal.name.clone());
	edit.color = ActiveValue::Set(modal.color.clone());
	
	let res = edit.clone()
					  .update(db).await
					  .into_report()
					  .attach_printable_lazy(|| "Error editing type in DB")
					  .attach_printable_lazy(|| format!("edit:{:#?} name:{} color:{}", edit, modal.name, modal.color))
					  .change_context(DBError)?;
	
	println!("edited type:{:?}", res);
	
	Ok(())
}

pub async fn delete_type(db: &DatabaseConnection, delete: Delete) -> Result<(), DBError> {
	let res: DeleteResult = Entity::delete_by_id(delete.id)
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error deleting type in DB")
			.attach_printable_lazy(|| format!("id:{}", delete.id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Type not found".to_string()))
				.into_report()
				.attach_printable_lazy(|| "Error deleting type in DB")
				.attach_printable_lazy(|| format!("id:{}", delete.id))
				.change_context(DBError)?;
	}
	Ok(())
}