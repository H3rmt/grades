// @generated automatically by Diesel CLI.

diesel::table! {
    grade_types (id) {
        id -> Integer,
        name -> Text,
        color -> Text,
    }
}

diesel::table! {
    grades (id) {
        id -> Integer,
        subject -> Integer,
        grade_type -> Integer,
        info -> Nullable<Text>,
    }
}

diesel::table! {
    subjects (id) {
        id -> Integer,
        name -> Text,
        color -> Text,
    }
}

diesel::joinable!(grades -> grade_types (grade_type));
diesel::joinable!(grades -> subjects (subject));

diesel::allow_tables_to_appear_in_same_query!(
    grade_types,
    grades,
    subjects,
);
