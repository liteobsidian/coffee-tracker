export const GET = `
  select a.id, a.date, a.division_id, a.user_id,
         case when count(b.nomenclature_id) <> 0
                then jsonb_agg(jsonb_build_object(
                    'id', b.nomenclature_id,
                    'name', c.name,
                    'unit', c.unit,
                    'count', b.count
                ))
              else '[]'::jsonb
           end as nomenclature
  from inventory a
         left join inventory_content as b on a.id = b.inventory_id
         left join nomenclature as c on b.nomenclature_id = c.id
  where a.id = $1
  group by (a.id, a.date, a.division_id, a.user_id)
`
export const ADD = `
  with add_inventory as (
    insert into inventory(date, division_id, user_id) values($1, $2, $3)
    returning id
  )
    insert into inventory_content(inventory_id, nomenclature_id, count)
      select (select id from add_inventory) as id, nomenclature_id, count
      from jsonb_to_recordset($4) as a(nomenclature_id, count)
  returning *
`
// export const ADD_NOMENCLATURE = `
//   insert into division_nomenclature(division_id, nomenclature_id)
//   select $1::bigint as division_id, id as nomenclature_id
//   from jsonb_to_recordset($2) as a(id bigint)
//   returning *
// `

export const EDIT = `
  with del_nomenclature as (
    delete from inventory_content where inventory_id = $1
  ),  add_nomenclature as (
    insert into inventory_content(inventory_id, nomenclature_id, count)
      select $1::bigint as division_id, id as nomenclature_id, count
      from jsonb_to_recordset($6) as a(id bigint, count bigint)
  )
  update division set name=$2, address=$3, city=$4, factor=$5 where id=$1
  returning *
`
export const DELETE = `
  with del_nomenclature as (
    delete from inventory_content where inventory_id = $1
    returning $1 as id
  )
  delete from inventory where id=$1
  returning $1
`

export const LIST = `
  select a.id, a.date, a.division_id, d.name as division_name, a.user_id, e.name as user_name,
         case when count(b.nomenclature_id) <> 0
             then jsonb_agg(jsonb_build_object('id', b.nomenclature_id, 'name', c.name, 'unit', c.unit))
             else '[]'::jsonb
             end as nomenclature
  from inventory a
    left join division d on a.division_id = d.id
    left join auth_users e on a.user_id = e.id
    left join inventory_content as b on a.id = b.inventory_id
    left join nomenclature as c on b.nomenclature_id = c.id
  where $1 = '' or a.name~*$1
  group by (a.id, a.date, a.division_id, d.name, a.user_id, e.name)
  order by a.name
`
