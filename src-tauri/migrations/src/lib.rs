pub use sea_orm_migration::prelude::*;

mod m20220906_221454_added_types_and_subjects_tables;
mod m20220907_021039_added_grades_table;
mod m20220907_022500_added_unique_indexes;
mod m20220907_201550_added_grade_to_grade;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
	fn migrations() -> Vec<Box<dyn MigrationTrait>> {
		vec![
			Box::new(m20220906_221454_added_types_and_subjects_tables::Migration),
			Box::new(m20220907_021039_added_grades_table::Migration),
			Box::new(m20220907_022500_added_unique_indexes::Migration),
			Box::new(m20220907_201550_added_grade_to_grade::Migration),
		]
	}
}
