alter table workday add constraint workday_check_unique
  unique (date, auth_user_id);
