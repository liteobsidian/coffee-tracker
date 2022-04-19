alter table workday drop column profit;
alter table workday add column uncash_sum numeric(10,2);
comment on column workday.uncash_sum is 'Выручка безнал';
alter table workday add column cash_sum numeric(10,2);
comment on column workday.cash_sum is 'Выручка наличка';
alter table workday add column date_open timestamp;
comment on column workday.date_open is 'Дата/время открытия смены';
alter table workday add column date_close timestamp;
comment on column workday.date_close is 'Дата/время закрытия смены';
