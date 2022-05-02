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
  group by (a.id, a.name, a.address, a.city, a.factor)
`
export const ADD = `
  with add_inventory as (
    insert into inventory(date, division_id, user_id) values($1, $2, $3)
    returning id
  )
    insert into inventory_content(inventory_id, nomenclature_id, count)
      select $1::bigint as division_id, id as nomenclature_id
      from jsonb_to_recordset($4) as a((select id from add_inventory) as id bigint,nomenclature_id bigint, count bigint)
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
    delete from division_nomenclature where division_id = $1
  ),  add_nomenclature as (
    insert into division_nomenclature(division_id, nomenclature_id)
      select $1::bigint as division_id, id as nomenclature_id
      from jsonb_to_recordset($6) as a(id bigint)
  )
  update division set name=$2, address=$3, city=$4, factor=$5 where id=$1
  returning *
`
export const DELETE = `
  with del_nomenclature as (
    delete from division_nomenclature where division_id = $1
    returning $1 as id
  )
  delete from division where id=$1
  returning $1
`

export const LIST = `
  select a.id, a.name, a.address, a.city, a.factor,
         case when count(b.nomenclature_id) <> 0
             then jsonb_agg(jsonb_build_object('id', b.nomenclature_id, 'name', c.name, 'unit', c.unit))
             else '[]'::jsonb
             end as nomenclature
  from division a
  left join division_nomenclature as b on a.id = b.division_id
  left join nomenclature as c on b.nomenclature_id = c.id
  where $1 = '' or a.name~*$1
  group by (a.id, a.name, a.address, a.city, a.factor)
  order by a.name
`
