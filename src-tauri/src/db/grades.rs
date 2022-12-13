use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{ActiveModelTrait, ActiveValue, DatabaseConnection, DbErr, DeleteResult, EntityTrait, InsertResult};
use tokio::sync::Mutex;

use entity::prelude::{*};

use crate::{
	config::main::Config,
	db::{
		error::DBError,
		utils::check_fk,
	},
	utils::StrError,
};

pub async fn get_grades(db: &DatabaseConnection) -> Result<Vec<Grade>, DBError> {
	Grades::find()
			.all(db).await
//	Err(StrError("get_grades not implemented".to_string()))
			.into_report()
			.attach_printable("Error loading grades from DB")
			.change_context(DBError)
}

pub async fn create_grade(db: &DatabaseConnection, config: &Mutex<Config>, grade: Grade) -> Result<i32, DBError> {
	check_fk(db, Subjects::find_by_id(grade.subject), "subject".to_string())
			.await
			.attach_printable("Check if subject exists failed")
			.attach_printable(format!("subject id: {}", grade.subject))?;
	check_fk(db, GradeTypes::find_by_id(grade.r#type), "type".to_string())
			.await
			.attach_printable("Check if type exists failed")
			.attach_printable(format!("type id: {}", grade.r#type))?;
	check_fk(db, Periods::find_by_id(grade.period), "period".to_string())
			.await
			.attach_printable("Check if period exists failed")
			.attach_printable(format!("period id: {}", grade.period))?;
	{
		let mutex = config.lock().await;
		let note_range = &mutex.get().note_range;
		
		if let Some(i) = grade.grade {
			if i < note_range.from || i > note_range.to {
				return Err(StrError("Grade out of range".to_string()))
						.into_report()
						.attach_printable(format!("grade: {:?}", grade.grade))
						.attach_printable(format!("range: {}", note_range))
						.change_context(DBError);
			}
		}
	}
	
	let insert = ActiveGrade {
		id: ActiveValue::NotSet,
		subject: ActiveValue::Set(grade.subject),
		r#type: ActiveValue::Set(grade.r#type),
		info: ActiveValue::Set(grade.info.clone()),
		grade: ActiveValue::Set(grade.grade),
		period: ActiveValue::Set(grade.period),
		weight: ActiveValue::Set(grade.weight.clone()),
		confirmed: ActiveValue::Set(grade.confirmed.clone()),
		date: ActiveValue::Set(grade.date.clone()),
	};
	
	let res: InsertResult<ActiveGrade> = Grades::insert(insert.clone())
			.exec(db).await
			.into_report()
			.attach_printable("Error creating grade in DB")
			.attach_printable(format!("insert:{:?} subject:{} type:{} info:{} grade:{:?} period:{} weight:{}",
			                          insert, grade.subject, grade.r#type, grade.info, grade.grade, grade.period, grade.weight))
			.change_context(DBError)?;
	
	log::info!("created grade, id:{}", res.last_insert_id);
	Ok(res.last_insert_id)
}

pub async fn edit_grade(db: &DatabaseConnection, config: &Mutex<Config>, grade: Grade) -> Result<Grade, DBError> {
	let edit: Option<Grade> = Grades::find_by_id(grade.id)
			.one(db).await
			.into_report()
			.attach_printable("Error finding grade in DB")
			.attach_printable(format!("id:{}", grade.id))
			.change_context(DBError)?;
	
	let mut edit: ActiveGrade = edit
			.ok_or_else(|| DbErr::RecordNotFound("Grade not found".to_string()))
			.into_report()
			.attach_printable("Error finding grade in DB")
			.attach_printable(format!("id:{}", grade.id))
			.change_context(DBError)?
			.into();
	
	check_fk(db, Subjects::find_by_id(grade.subject), "subject".to_string())
			.await
			.attach_printable("Check if subject exists failed")
			.attach_printable(format!("subject id: {}", grade.subject))?;
	check_fk(db, GradeTypes::find_by_id(grade.r#type), "type".to_string())
			.await
			.attach_printable("Check if type exists failed")
			.attach_printable(format!("type id: {}", grade.r#type))?;
	check_fk(db, Periods::find_by_id(grade.period), "period".to_string())
			.await
			.attach_printable("Check if period exists failed")
			.attach_printable(format!("period id: {}", grade.period))?;
	{
		let mutex = config.lock().await;
		let note_range = &mutex.get().note_range;
		
		if let Some(i) = grade.grade {
			if i < note_range.from || i > note_range.to {
				return Err(StrError("Grade out of range".to_string()))
						.into_report()
						.attach_printable(format!("grade: {:?}", grade.grade))
						.attach_printable(format!("range: {}", note_range))
						.change_context(DBError);
			}
		}
	}
	
	edit.subject = ActiveValue::Set(grade.subject);
	edit.r#type = ActiveValue::Set(grade.r#type);
	edit.info = ActiveValue::Set(grade.info.clone());
	edit.grade = ActiveValue::Set(grade.grade);
	edit.period = ActiveValue::Set(grade.period);
	edit.weight = ActiveValue::Set(grade.weight.clone());
	edit.confirmed = ActiveValue::Set(grade.confirmed.clone());
	edit.date = ActiveValue::Set(grade.date.clone());
	
	let res: Grade = edit.clone()
	                     .update(db).await
	                     .into_report()
	                     .attach_printable("Error editing grade in DB")
	                     .attach_printable(format!("edit:{:?} subject:{} type:{} info{} grade:{:?} period:{} weight:{} confirmed:{:?} date:{}",
	                                               edit, grade.subject, grade.r#type, grade.info, grade.grade, grade.period, grade.weight, grade.confirmed, grade.date))
	                     .change_context(DBError)?;
	
	log::info!("edited grade:{:?}", res);
	Ok(res)
}

pub async fn delete_grade(db: &DatabaseConnection, id: i32) -> Result<(), DBError> {
	let res: DeleteResult = Grades::delete_by_id(id)
			.exec(db).await
			.into_report()
			.attach_printable("Error deleting grade in DB")
			.attach_printable(format!("id:{}", id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Grade not found".to_string()))
				.into_report()
				.attach_printable("Error deleting grade in DB")
				.attach_printable(format!("id:{}", id))
				.change_context(DBError)?;
	}
	
	log::info!("deleted grade, id:{}", id);
	Ok(())
}