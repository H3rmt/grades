//! SeaORM Entity. Generated by sea-orm-codegen 0.9.3

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
	fn table_name(&self) -> &str {
		"grade_types"
	}
}

#[derive(TS, Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Serialize, Deserialize)]
#[ts(export, export_to = "../../src/entity/type.ts")]
pub struct Model {
	#[serde(skip_deserializing)]
	pub id: i32,
	pub name: String,
	pub color: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
	Id,
	Name,
	Color,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
	Id,
}

impl PrimaryKeyTrait for PrimaryKey {
	type ValueType = i32;
	fn auto_increment() -> bool {
		true
	}
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
	Grades,
}

impl ColumnTrait for Column {
	type EntityName = Entity;
	fn def(&self) -> ColumnDef {
		match self {
			Self::Id => ColumnType::Integer.def(),
			Self::Name => ColumnType::String(None).def(),
			Self::Color => ColumnType::String(None).def(),
		}
	}
}

impl RelationTrait for Relation {
	fn def(&self) -> RelationDef {
		match self {
			Self::Grades => Entity::has_many(super::grades::Entity).into(),
		}
	}
}

impl Related<super::grades::Entity> for Entity {
	fn to() -> RelationDef {
		Relation::Grades.def()
	}
}

impl ActiveModelBehavior for ActiveModel {}
