drop table workday_content;

CREATE TABLE inventory (id serial, date date not null, division_id bigint not null , user_id bigint);
alter table inventory
add constraint inventory_check_unique
	unique (date, division_id);
alter table inventory
add constraint inventory_pkey
	primary key (id);

CREATE TABLE inventory_content (id serial, inventory_id bigint not null, nomenclature_id bigint not null , count numeric(10, 2));
alter table inventory_content
add constraint inventory_content_check_unique
	unique (inventory_id, nomenclature_id);
alter table inventory_content
add constraint inventory_content_pkey
	primary key (id);
