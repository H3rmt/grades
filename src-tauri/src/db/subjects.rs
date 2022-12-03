use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{
	ActiveModelTrait,
	ActiveValue,
	ColumnTrait,
	DatabaseConnection,
	DbErr,
	DeleteResult,
	EntityTrait,
	InsertResult,
	QueryFilter,
};

use entity::prelude::{*};

use crate::{
	db::error::DBError,
	utils::StrError,
};

pub async fn get_subjects(db: &DatabaseConnection) -> Result<Vec<Subject>, DBError> {
	Subjects::find()
			.all(db).await
			.into_report()
			.attach_printable("Error loading subjects from DB")
			.change_context(DBError)
}

pub async fn create_subject(db: &DatabaseConnection, model: Subject) -> Result<i32, DBError> {
	let insert = ActiveSubject {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(model.name.clone()),
		color: ActiveValue::Set(model.color.clone()),
	};
	
	let res: InsertResult<ActiveSubject> = Subjects::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable("Error creating subject in DB")
			.attach_printable(format!("insert:{:?} name:{} color:{}",
			                          insert, model.name, model.color))
			.change_context(DBError)?;
	
	log::info!("created subject, id:{}", res.last_insert_id);
	Ok(res.last_insert_id)
}

pub async fn edit_subject(db: &DatabaseConnection, modal: Subject) -> Result<Subject, DBError> {
	let edit: Option<Subject> = Subjects::find_by_id(modal.id)
			.one(db).await
			.into_report()
			.attach_printable("Error finding subject in DB")
			.attach_printable(format!("id:{}", modal.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveSubject = edit
			.ok_or_else(|| DbErr::RecordNotFound("Subject not found".to_string()))
			.into_report()
			.attach_printable("Error finding subject in DB")
			.attach_printable(format!("id:{}", modal.id))
			.change_context(DBError)?
			.into();
	
	edit.name = ActiveValue::Set(modal.name.clone());
	edit.color = ActiveValue::Set(modal.color.clone());
	
	let res = edit.clone()
	              .update(db).await
	              .into_report()
	              .attach_printable("Error editing subject in DB")
	              .attach_printable(format!("edit:{:?} name:{} color:{}",
	                                        edit, modal.name, modal.color))
	              .change_context(DBError)?;
	
	log::info!("edited subject:{:?}", res);
	Ok(res)
}

pub async fn delete_subject(db: &DatabaseConnection, id: i32) -> Result<(), DBError> {
	let f: Vec<Grade> = Grades::find()
			.filter(GradeColumn::Subject.eq(id))
			.all(db).await
			.into_report()
			.attach_printable("Error checking for referencing grades in DB")
			.attach_printable(format!("id:{}", id))
			.change_context(DBError)?;
	
	if !f.is_empty() {
		return Err(StrError(format!("Cannot delete subject, it is referenced by {} grades", f.len())))
				.into_report()
				.attach_printable("Error deleting subject in DB")
				.attach_printable(format!("id:{}", id))
				.change_context(DBError)?;
	}
	
	let res: DeleteResult = Subjects::delete_by_id(id)
			.exec(db).await
			.into_report()
			.attach_printable("Error deleting subject in DB")
			.attach_printable(format!("id:{}", id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Subject not found".to_string()))
				.into_report()
				.attach_printable("Error deleting subject in DB")
				.attach_printable(format!("id:{}", id))
				.change_context(DBError)?;
	}
	
	log::info!("deleted subject, id:{}", id);
	Ok(())
}