use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{
	ActiveModelTrait,
	ActiveValue,
	ColumnTrait,
	DatabaseConnection,
	DbErr,
	DeleteResult,
	EntityTrait,
	QueryFilter,
};

use entity::prelude::{*};

use crate::{
	db::error::DBError,
	utils::StrError,
};

pub async fn get_periods(db: &DatabaseConnection) -> Result<Vec<Period>, DBError> {
	Periods::find()
			.all(db).await
			.into_report()
			.attach_printable("Error loading periods from DB")
			.change_context(DBError)
}

pub async fn create_period(db: &DatabaseConnection, model: Period) -> Result<i32, DBError> {
	let insert = ActivePeriod {
		id: ActiveValue::NotSet,
		name: ActiveValue::Set(model.name.clone()),
		from: ActiveValue::Set(model.from.clone()),
		to: ActiveValue::Set(model.to.clone()),
	};
	
	let res: Period = insert.clone()
									.insert(db).await
									.into_report()
									.attach_printable("Error creating period in DB")
									.attach_printable_lazy(|| format!("insert:{:?} name:{} from:{} to:{}",
																				 insert, model.name, model.from, model.to))
									.change_context(DBError)?;
	
	log::info!("created period:{:?}", res);
	Ok(res.id)
}

pub async fn edit_period(db: &DatabaseConnection, model: Period) -> Result<Period, DBError> {
	let edit: Option<Period> = Periods::find_by_id(model.id)
			.one(db).await
			.into_report()
			.attach_printable("Error finding period in DB")
			.attach_printable_lazy(|| format!("id:{}", model.id))
			.change_context(DBError)?;
	
	let mut edit: ActivePeriod = edit
			.ok_or_else(|| DbErr::RecordNotFound("Period not found".to_string()))
			.into_report()
			.attach_printable("Error finding period in DB")
			.attach_printable_lazy(|| format!("id:{}", model.id))
			.change_context(DBError)?
			.into();
	
	edit.name = ActiveValue::Set(model.name.clone());
	edit.from = ActiveValue::Set(model.from.clone());
	edit.to = ActiveValue::Set(model.to.clone());
	
	let res = edit.clone()
					  .update(db).await
					  .into_report()
					  .attach_printable("Error editing period in DB")
					  .attach_printable_lazy(|| format!("edit:{:#?} name:{} from:{} to:{}", edit, model.name, model.from, model.to))
					  .change_context(DBError)?;
	
	log::info!("edited period:{:?}", res);
	Ok(res)
}

pub async fn delete_period(db: &DatabaseConnection, id: i32) -> Result<(), DBError> {
	let f: Vec<Grade> = Grades::find()
			.filter(GradeColumn::Period.eq(id))
			.all(db).await
			.into_report()
			.attach_printable("Error checking for referencing grades in DB")
			.attach_printable_lazy(|| format!("id:{}", id))
			.change_context(DBError)?;
	
	if !f.is_empty() {
		return Err(StrError(format!("Cannot delete period, it is referenced by {} grades", f.len())))
				.into_report()
				.attach_printable("Error deleting period in DB")
				.attach_printable_lazy(|| format!("id:{}", id))
				.change_context(DBError)?;
	}
	
	let res: DeleteResult = Periods::delete_by_id(id)
			.exec(db).await
			.into_report()
			.attach_printable("Error deleting period in DB")
			.attach_printable_lazy(|| format!("id:{}", id))
			.change_context(DBError)?;
	
	if res.rows_affected < 1 {
		Err(DbErr::RecordNotFound("Period not found".to_string()))
				.into_report()
				.attach_printable("Error deleting period in DB")
				.attach_printable_lazy(|| format!("id:{}", id))
				.change_context(DBError)?;
	}
	
	log::info!("deleted period, id:{}", id);
	Ok(())
}
