// @generated automatically by Diesel CLI.

diesel::table! {
    grades (id) {
        id -> Integer,
        subject -> Integer,
        #[sql_name = "type"]
        type_ -> Integer,
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

diesel::table! {
    types (id) {
        id -> Integer,
        name -> Text,
        color -> Text,
    }
}

diesel::joinable!(grades -> subjects (subject));
diesel::joinable!(grades -> types (type_));

diesel::allow_tables_to_appear_in_same_query!(
    grades,
    subjects,
    types,
);
