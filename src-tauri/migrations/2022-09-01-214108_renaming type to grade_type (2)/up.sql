-- Your SQL goes here
create table grades_dg_tmp
(
    id         INTEGER not null
        primary key autoincrement,
    subject    INTEGER not null
        constraint subjects_fk
            references subjects,
    grade_type INTEGER not null
        constraint subjects_fk
            references grade_types,
    info       TEXT default ''
);

insert into grades_dg_tmp(id, subject, grade_type, info)
select id, subject, type, info
from grades;

drop table grades;

alter table grades_dg_tmp
    rename to grades;

create unique index id_index_grades
    on grades (id);
