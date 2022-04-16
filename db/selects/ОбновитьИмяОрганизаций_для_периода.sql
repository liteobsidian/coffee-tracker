-- UPDATE stat.organization
-- 	SET list_name = jsonb_set(
--     list_name,'[{"period": "2021-02-01","name": "Государственное учреждение здравоохранения \"Липецкий областной перинатальный центр!!!"}]'::jsonb
-- WHERE id =1 ;

update 
    stat.organization
set
    list_name = 
        jsonb_set(
            list_name,
            array['', elem_index::text, 'period'],
            '"2021-02-01"'::jsonb,
            true)
from (
    select 
        pos- 1 as elem_index
    from 
        stat.organization, 
        jsonb_array_elements(list_name->'') with ordinality arr(elem, pos)
    where
        id = 1 and
        elem->>'period' = '2021-02-01'
    ) sub
where
    id = 1; 