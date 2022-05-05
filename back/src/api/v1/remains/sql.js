export const LIST = `

  select a.id, a.date, a.division_id, d.name as division_name, a.user_id, e.name as user_name,
         case when count(b.nomenclature_id) <> 0
             then jsonb_agg(jsonb_build_object('id', b.nomenclature_id, 'name', c.name, 'unit', c.unit, 'count', b.count))
             else '[]'::jsonb
             end as nomenclature, sum(c.cost * b.count)::numeric(15,2) as total_sum
  from inventory a
    left join division d on a.division_id = d.id
    left join auth_users e on a.user_id = e.id
    left join inventory_content as b on a.id = b.inventory_id
    left join nomenclature as c on b.nomenclature_id = c.id
  where $1 = '' or d.name~*$1
  group by (a.id, a.date, a.division_id, d.name, a.user_id, e.name)
  order by a.date, d.name
`
