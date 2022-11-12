use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;

use entity::subjects::{Entity, Model, ActiveModel};
use crate::commands::other::Delete;

use crate::db::DBError;

pub async fn get_subjects(db: &DatabaseConnection) -> Result<Vec<Model>, DBError> {
	Entity::find()
			.all(db).await
			.into_report()
			.attach_printable_lazy(|| "Error loading subjects from DB")
			.change_context(DBError)
}

pub async fn create_subject(db: &DatabaseConnection, model: Model) -> Result<(), DBError> {
	let insert = ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(model.name.clone()),
		color: ActiveValue::Set(model.color.clone()),
	};
	
	let res = Entity::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error creating subject in DB")
			.attach_printable_lazy(|| format!("insert:{:#?} name:{} color:{}", insert, model.name, model.color))
			.change_context(DBError)?;
	
	println!("created subject:{:?}", res);
	
	Ok(())
}

pub async fn edit_subject(db: &DatabaseConnection, modal: Model) -> Result<(), DBError> {
	let edit: Option<Model> = Entity::find_by_id(modal.id)
			.one(db).await
			.into_report()
			.attach_printable_lazy(|| "Error finding subject in DB")
			.attach_printable_lazy(|| format!("id:{}", modal.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveModel = edit
			.ok_or_else(|| DbErr::RecordNotFound("Subject not found".to_string()))
			.into_report()
			.attach_printable_lazy(|| "Error finding subject in DB")
			.attach_printable_lazy(|| format!("id:{}", modal.id))
			.change_context(DBError)?
			.into();
	
	edit.name = ActiveValue::Set(modal.name.clone());
	edit.color = ActiveValue::Set(modal.color.clone());
	
	let res = edit.clone()
					  .update(db).await
					  .into_report()
					  .attach_printable_lazy(|| "Error editing subject in DB")
					  .attach_printable_lazy(|| format!("edit:{:#?} name:{} color:{}", edit, modal.name, modal.color))
					  .change_context(DBError)?;
	
	println!("edited subject:{:?}", res);
	
	Ok(())
}

pub async fn delete_subject(db: &DatabaseConnection, delete: Delete) -> Result<(), DBError> {
	let res: DeleteResult = Entity::delete_by_id(delete.id)
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error deleting subject in DB")
			.attach_printable_lazy(|| format!("id:{}", delete.id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Subject not found".to_string()))
				.into_report()
				.attach_printable_lazy(|| "Error deleting subject in DB")
				.attach_printable_lazy(|| format!("id:{}", delete.id))
				.change_context(DBError)?;
	}
	Ok(())
}