pub use sea_orm_migration::prelude::*;

mod m20220906_221454_added_types_and_subjects_tables;
mod m20220907_021039_added_grades_table;
mod m20220907_022500_added_unique_indexes;
mod m20220907_201550_added_grade_to_grade;
mod m20220929_160232_added_periods_table;
mod m20221012_174650_added_period_to_grade;
mod m20221012_184535_added_not_final_and_count2_to_grade;
mod m20221016_122525_add_settings_to_db;
mod m20221108_010923_removed_settings;
mod m20221108_011056_added_unique_indexes_period;
mod m20221204_223500_add_dates_to_grade;
mod m20221205_125634_removed_double_added_weight_to_grades;
mod m20221213_121035_made_grade_optional_removed_not_final;
mod m20230102_000204_move_weights_into_separate_table;
mod m20230102_011659_move_replaced_grade_weight_enum_with_weight_fk;
mod m20230208_190225_made_date_optional;


pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
   fn migrations() -> Vec<Box<dyn MigrationTrait>> {
      vec![
         Box::new(m20220906_221454_added_types_and_subjects_tables::Migration),
         Box::new(m20220907_021039_added_grades_table::Migration),
         Box::new(m20220907_022500_added_unique_indexes::Migration),
         Box::new(m20220907_201550_added_grade_to_grade::Migration),
         Box::new(m20220929_160232_added_periods_table::Migration),
         Box::new(m20221012_174650_added_period_to_grade::Migration),
         Box::new(m20221012_184535_added_not_final_and_count2_to_grade::Migration),
         Box::new(m20221016_122525_add_settings_to_db::Migration),
         Box::new(m20221108_010923_removed_settings::Migration),
         Box::new(m20221108_011056_added_unique_indexes_period::Migration),
         Box::new(m20221204_223500_add_dates_to_grade::Migration),
         Box::new(m20221205_125634_removed_double_added_weight_to_grades::Migration),
         Box::new(m20221213_121035_made_grade_optional_removed_not_final::Migration),
         Box::new(m20230102_000204_move_weights_into_separate_table::Migration),
         Box::new(m20230102_011659_move_replaced_grade_weight_enum_with_weight_fk::Migration),
         Box::new(m20230208_190225_made_date_optional::Migration),
      ]
	}
}
