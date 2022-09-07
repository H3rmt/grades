extern crate dotenv;

use std::env;

use dotenv::dotenv;
use sea_orm::{Database, DatabaseConnection};

pub async fn establish_connection() -> DatabaseConnection {
	dotenv().ok();
	let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
	Database::connect(database_url).await.unwrap()
}

//pub fn create_grade(conn: &mut SqliteConnection, _subject: &Subject, _grade_type: &GradeType, _info: &str) -> Result<Grade, diesel::result::Error> {
//	let new_grade = NewGrade {
//		subject: &_subject.id,
//		grade_type: &_grade_type.id,
//		info: _info,
//	};
//
//	use crate::schema::grades::dsl::*;
//
//	let ret = diesel::insert_into(grades).values(&new_grade).execute(conn);
//	println!("{:?}", ret);
//
////	return match  {
////		Ok(s) => {
////			Ok(grades.order(id.desc()).first(conn));
////		}
////		Err(e) => {
////			Err(e);
////		}
////	};
//}

//
//pub fn todos_create(conn: &SqliteConnection, title: &str, body: &str) -> String {
//	let new_todo = NewTodo { title, body };
//	let todo = diesel::insert_into(todos::table)
//			.values(&new_todo)
//			.execute(conn)
//			.expect("Error saving new post");
//	let todo_json = serde_json::to_string(&todo).unwrap();
//	todo_json
//}
//
//pub fn todos_list(conn: &SqliteConnection) -> String {
//	let all_todos = todos::dsl::todos
//			.load::<Todo>(conn)
//			.expect("Expect loading posts");
//	let serialized = serde_json::to_string(&all_todos).unwrap();
//	serialized
//}
//
//pub fn todos_toggle(conn: &SqliteConnection, qid: i32) -> String {
//	use todos::dsl::{done, id};
//	let t = todos::dsl::todos
//			.filter(id.eq(&qid))
//			.first::<Todo>(conn)
//			.expect("Todo not found");
//	diesel::update(todos::dsl::todos.filter(id.eq(&qid)))
//			.set(done.eq(!t.done))
//			.execute(conn)
//			.expect("Error updating");
//	let updated = todos::dsl::todos
//			.filter(id.eq(&qid))
//			.first::<Todo>(conn)
//			.expect("Todo not found");
//	serde_json::to_string(&updated).unwrap()
//}
//
//pub fn todos_delete(conn: &SqliteConnection, qid: i32) {
//	use todos::dsl::{id};
//	let t = todos::dsl::todos.filter(id.eq(&qid));
//	diesel::delete(t)
//			.execute(conn)
//			.expect("error deleting todo");
//}