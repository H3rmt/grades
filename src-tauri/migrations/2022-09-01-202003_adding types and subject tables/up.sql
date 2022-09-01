-- Your SQL goes here
create table types
(
    id    INTEGER not null
        primary key autoincrement,
    name  text default '' not null,
    color text default 'grey' not null
);

create unique index id_index_types
    on types (id);

create table subjects
(
    id    INTEGER not null
        primary key autoincrement,
    name  text default '' not null,
    color text default 'grey' not null
);

create index id_index_subjects
    on subjects (id);

