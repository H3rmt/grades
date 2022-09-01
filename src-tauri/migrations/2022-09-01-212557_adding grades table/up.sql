-- Your SQL goes here
create table grades
(
    id      INTEGER not null
        primary key autoincrement,
    subject integer not null
        constraint subjects_fk
            references subjects (id),
    type    integer not null
        constraint subjects_fk
            references types (id),
    info    text default ''
);

create unique index id_index_grades
    on grades (id);

