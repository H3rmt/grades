use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;

use entity::periods::{ActiveModel, Entity, Model};
use crate::commands::other::Delete;

use crate::db::DBError;

pub async fn get_periods(db: &DatabaseConnection) -> Result<Vec<Model>, DBError> {
	Entity::find()
			.all(db).await
			.into_report()
			.attach_printable_lazy(|| "Error loading periods from DB")
			.change_context(DBError)
}

pub async fn create_period(db: &DatabaseConnection, model: Model) -> Result<(), DBError> {
	let insert = ActiveModel {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(model.name.clone()),
		from: ActiveValue::Set(model.from.clone()),
		to: ActiveValue::Set(model.to.clone()),
	};
	
	let res = Entity::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error creating period in DB")
			.attach_printable_lazy(|| format!("insert:{:#?} name:{} from:{} to:{}", insert, model.name, model.from, model.to))
			.change_context(DBError)?;
	
	println!("created period:{:?}", res);
	
	Ok(())
}

pub async fn edit_period(db: &DatabaseConnection, model: Model) -> Result<(), DBError> {
	let edit: Option<Model> = Entity::find_by_id(model.id)
			.one(db).await
			.into_report()
			.attach_printable_lazy(|| "Error finding period in DB")
			.attach_printable_lazy(|| format!("id:{:?}", model.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveModel = edit
			.ok_or_else(|| DbErr::RecordNotFound("Period not found".to_string()))
			.into_report()
			.attach_printable_lazy(|| "Error finding period in DB")
			.attach_printable_lazy(|| format!("id:{:?}", model.id))
			.change_context(DBError)?
			.into();
	
	edit.name = ActiveValue::Set(model.name.clone());
	edit.from = ActiveValue::Set(model.from.clone());
	edit.to = ActiveValue::Set(model.to.clone());
	
	let res = edit.clone()
					  .update(db).await
					  .into_report()
					  .attach_printable_lazy(|| "Error editing period in DB")
					  .attach_printable_lazy(|| format!("edit:{:#?} name:{} from:{} to:{}", edit, model.name, model.from, model.to))
					  .change_context(DBError)?;
	
	println!("edited period:{:?}", res);
	
	Ok(())
}

pub async fn delete_period(db: &DatabaseConnection, delete: Delete) -> Result<(), DBError> {
	let res: DeleteResult = Entity::delete_by_id(delete.id)
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error deleting period in DB")
			.attach_printable_lazy(|| format!("id:{:?}", delete.id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Period not found".to_string()))
				.into_report()
				.attach_printable_lazy(|| "Error deleting period in DB")
				.attach_printable_lazy(|| format!("id:{:?}", delete.id))
				.change_context(DBError)?;
	}
	Ok(())
}
