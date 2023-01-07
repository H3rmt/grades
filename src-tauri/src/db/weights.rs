use error_stack::{IntoReport, Result, ResultExt};
use sea_orm::{DatabaseConnection, EntityTrait};

use entity::prelude::{*};

use crate::db::error::DBError;

pub async fn get_weights(db: &DatabaseConnection) -> Result<Vec<Weight>, DBError> {
	Weights::find()
			.all(db).await
			.into_report()
			.attach_printable("Error loading weights from DB")
			.change_context(DBError)
}

// editing weights not allowed