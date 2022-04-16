-- 1 Удалить подразделения закрепленные за организациями с пустыми значениями oid
DELETE FROM stat.division
where id in (
  SELECT d.id as id	FROM stat.division d
  join organization o on o.id=d.organization_id
  where o.list_oid is null)
  
-- 2 удалить организации с пустыми значениями oid
--   DELETE FROM stat.organization
-- 	WHERE list_oid is null;