-- INSERT INTO stat.organization (name,short_name,list_name)
-- VALUES('Поликлинника ТЕСТОВАЯ','ПТ','[{"period":"2021-01-01", "name":"name1" }, {"period":"2021-02-01", "name":"name2" } ]'::jsonb);

select o.id, o.oid, i.org ->> 'name' as name, i.org->>'period' as period
from organization o
cross join jsonb_array_elements(o.list_name) as i(org)
where i.org->>'period'='2021-01-01';

select o.id,o.oid, o.name, i.org ->> 'name' as pname, i.org->>'period' as period
from stat.organization o
cross join jsonb_array_elements(o.list_name) as i(org)
where i.org->>'period'='2021-05-01' ;

select o.id,o.parent_id, o.oid, i.org ->> 'name' as pname, i.org->>'period' as period
from stat.division o
cross join jsonb_array_elements(o.list_name) as i(org)
where i.org->>'period'='2021-04-01';

-- UPDATE stat.organization
-- SET list_name = '[{"period":"2021-01-01","name":"name01"}, {"period":"2021-02-01","name":"name02"}]'::jsonb
-- WHERE id = 150; 

-- select o.id, list_name
-- from stat.organization o
-- where o.id = 150
-- [ 150,
-- [
--     {
--         "name": "name01",
--         "period": "2021-01-01"
--     },
--     {
--         "name": "name02",
--         "period": "2021-02-01"
--     }
-- ]
--]

-- Обновить существующий элемент
-- UPDATE stat.organization
-- SET    list_name =
--    (
--    SELECT jsonb_set(list_name
--                   , '{items}'
--                   , jsonb_agg(CASE WHEN elem->>'period' = '2021-02-01'
--                                 THEN jsonb_set(elem, '{name}', to_jsonb(text 'name___02'))
--                                 ELSE elem
--                               END))
--    FROM   jsonb_array_elements(list_name->'items') elem
--    )
-- WHERE   id = 150;

-- {
--     "items": [
--         {
--             "name": "name01",
--             "period": "2021-01-01"
--         },
--         {
--             "name": "name___02",
--             "period": "2021-02-01"
--         }
--     ]
-- }

-- Добавляет новый безусловно - предварительно требуется проверить что период еще не добавлялся
-- UPDATE stat.organization o
-- SET list_name =
-- jsonb_set(o.list_name, '{items}'::text[], o.list_name ->'items' || '{"period":"20210-03-01", "name":"name03"}'::jsonb)
-- WHERE o.id =150;


-- Прочитать справочник наименований актуальных за период
-- select o.id, o.oid, i.org -> 'name' as name, i.org->'period' as period 
-- from stat.organization o
-- cross join jsonb_array_elements(o.list_name->'items') as i(org)
-- where i.org->>'period'='20210-03-01'
