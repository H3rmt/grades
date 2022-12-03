use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{
	ActiveModelTrait,
	ActiveValue,
	DatabaseConnection,
	DbErr,
	DeleteResult,
	EntityTrait,
	InsertResult,
};

use entity::prelude::{*};

use crate::db::error::DBError;

pub async fn get_types(db: &DatabaseConnection) -> Result<Vec<GradeType>, DBError> {
	GradeTypes::find()
			.all(db).await
			.into_report()
			.attach_printable("Error loading types from DB")
			.change_context(DBError)
}


pub async fn create_type(db: &DatabaseConnection, modal: GradeType) -> Result<i32, DBError> {
	let insert = ActiveGradeType {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(modal.name.clone()),
		color: ActiveValue::Set(modal.color.clone()),
	};
	
	let res: InsertResult<ActiveGradeType> = GradeTypes::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable("Error creating type in DB")
			.attach_printable(format!("insert:{:?} name:{} color:{}",
			                          insert, modal.name, modal.color))
			.change_context(DBError)?;
	
	log::info!("created type:{:?}", res);
	Ok(res.last_insert_id)
}

pub async fn edit_type(db: &DatabaseConnection, modal: GradeType) -> Result<GradeType, DBError> {
	let edit: Option<GradeType> = GradeTypes::find_by_id(modal.id)
			.one(db).await
			.into_report()
			.attach_printable("Error finding type in DB")
			.attach_printable(format!("id:{}", modal.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveGradeType = edit
			.ok_or_else(|| DbErr::RecordNotFound("Type not found".to_string()))
			.into_report()
			.attach_printable("Error finding type in DB")
			.attach_printable(format!("id:{}", modal.id))
			.change_context(DBError)?
			.into();
	
	edit.name = ActiveValue::Set(modal.name.clone());
	edit.color = ActiveValue::Set(modal.color.clone());
	
	let res = edit.clone()
	              .update(db).await
	              .into_report()
	              .attach_printable("Error editing type in DB")
	              .attach_printable(format!("edit:{:?} name:{} color:{}",
	                                        edit, modal.name, modal.color))
	              .change_context(DBError)?;
	
	log::info!("edited type:{:?}", res);
	Ok(res)
}

pub async fn delete_type(db: &DatabaseConnection, id: i32) -> Result<(), DBError> {
//	let f: Vec<Grade> = Grades::find()
//			.filter(Grades::Column::Type.eq(id))
//			.all(db).await
//			.into_report()
//			.attach_printable("Error checking for referencing grades in DB")
//			.attach_printable(format!("id:{}", id))
//			.change_context(DBError)?;
//
//	if !f.is_empty() {
//		return Err(StrError(format!("Cannot delete subject, it is referenced by {} grades", f.len())))
//				.into_report()
//				.attach_printable("Error deleting subject in DB")
//				.attach_printable(format!("id:{}", id))
//				.change_context(DBError)?;
//	}
	
	let res: DeleteResult = GradeTypes::delete_by_id(id)
			.exec(db).await
			.into_report()
			.attach_printable("Error deleting type in DB")
			.attach_printable(format!("id:{}", id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Type not found".to_string()))
				.into_report()
				.attach_printable("Error deleting type in DB")
				.attach_printable(format!("id:{}", id))
				.change_context(DBError)?;
	}
	
	log::info!("deleted type, id:{}", id);
	Ok(())
}