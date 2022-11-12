use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{ActiveValue, DatabaseConnection, DbErr, DeleteResult};
use sea_orm::ActiveModelTrait;
use sea_orm::EntityTrait;

use entity::grades::{ActiveModel, Entity, Model};
use entity::{grade_types, periods, subjects};

use crate::db::{check_fk, DBError};
use crate::commands::other::{Delete};

pub async fn get_grades(db: &DatabaseConnection) -> Result<Vec<Model>, DBError> {
	Entity::find()
			.all(db).await
			.into_report()
			.attach_printable_lazy(|| "Error loading grades from DB")
			.change_context(DBError)
}

pub async fn create_grade(db: &DatabaseConnection, model: Model) -> Result<(), DBError> {
	check_fk(db, subjects::Entity::find_by_id(model.subject)).await.attach_printable_lazy(|| "Check if Subject exists failed").attach_printable_lazy(|| format!("subject id: {}", model.subject))?;
	check_fk(db, grade_types::Entity::find_by_id(model.r#type)).await.attach_printable_lazy(|| "Check if Type exists failed").attach_printable_lazy(|| format!("type id: {}", model.r#type))?;
	check_fk(db, periods::Entity::find_by_id(model.period)).await.attach_printable_lazy(|| "Check if Period exists failed").attach_printable_lazy(|| format!("period id: {}", model.period))?;
	
	let insert = ActiveModel {
		id: ActiveValue::NotSet,
		subject: ActiveValue::Set(model.subject),
		r#type: ActiveValue::Set(model.r#type),
		info: ActiveValue::Set(model.info.clone()),
		grade: ActiveValue::Set(model.grade),
		period: ActiveValue::Set(model.period),
		double: ActiveValue::Set(model.double),
		not_final: ActiveValue::Set(model.not_final),
	};
	
	let res = Entity::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error creating grade in DB")
			.attach_printable_lazy(|| format!("insert:{:?} subject:{} type:{} info:{} grade:{} period:{} double:{} not_final:{}", insert, model.subject, model.r#type, model.info, model.grade, model.period, model.double, model.not_final))
			.change_context(DBError)?;
	
	println!("created grade:{:?}", res);
	
	Ok(())
}

pub async fn edit_grade(db: &DatabaseConnection, model: Model) -> Result<(), DBError> {
	let edit: Option<Model> = Entity::find_by_id(model.id)
			.one(db).await
			.into_report()
			.attach_printable_lazy(|| "Error finding grade in DB")
			.attach_printable_lazy(|| format!("id:{}", model.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveModel = edit
			.ok_or_else(|| DbErr::RecordNotFound("Grade not found".to_string()))
			.into_report()
			.attach_printable_lazy(|| "Error finding grade in DB")
			.attach_printable_lazy(|| format!("id:{}", model.id))
			.change_context(DBError)?
			.into();
	
	edit.subject = ActiveValue::Set(model.subject);
	edit.r#type = ActiveValue::Set(model.r#type);
	edit.info = ActiveValue::Set(model.info.clone());
	edit.grade = ActiveValue::Set(model.grade);
	edit.period = ActiveValue::Set(model.period);
	edit.not_final = ActiveValue::Set(model.not_final);
	edit.double = ActiveValue::Set(model.double);
	
	let res = edit.clone()
					  .update(db).await
					  .into_report()
					  .attach_printable_lazy(|| "Error editing grade in DB")
					  .attach_printable_lazy(|| format!("edit:{:?} subject:{} type:{} info:{} grade:{} period:{} double:{} not_final:{}", edit, model.subject, model.r#type, model.info, model.grade, model.period, model.double, model.not_final))
					  .change_context(DBError)?;
	
	println!("edited grade:{:?}", res);
	
	Ok(())
}

pub async fn delete_grade(db: &DatabaseConnection, delete: Delete) -> Result<(), DBError> {
	let res: DeleteResult = Entity::delete_by_id(delete.id)
			.exec(db).await
			.into_report()
			.attach_printable_lazy(|| "Error deleting grade in DB")
			.attach_printable_lazy(|| format!("id:{}", delete.id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Grade not found".to_string()))
				.into_report()
				.attach_printable_lazy(|| "Error deleting grade in DB")
				.attach_printable_lazy(|| format!("id:{}", delete.id))
				.change_context(DBError)?;
	}
	Ok(())
}