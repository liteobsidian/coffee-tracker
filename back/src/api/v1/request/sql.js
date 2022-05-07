export const ADD = `
  insert into request(date_create, division_id, user_id) values($1::date, $2, $3)
  returning id
`
export const ADD_NOMENCLATURE = `
  insert into request_content (request_id, nomenclature_id, count)
  select $1::bigint as division_id, id as nomenclature_id, count
  from jsonb_to_recordset($2) as a(id bigint, count bigint)
  returning *
`

export const EDIT = `
  update request set date_create=$2::date, division_id=$3, user_id=$4, is_accept=$5, date_accept=$6 where id=$1
  returning *
`

export const ACCEPT = `
  update request set is_accept=true, date_accept=current_date where id=$1
  returning *
`

export const EDIT_NOMENCLATURE = `
  with del_nomenclature as (
    delete from request_content where request_id = $1::bigint
  )
  insert into request_content(request_id, nomenclature_id, count)
    select $1::bigint as request_id, id as nomenclature_id, count
    from jsonb_to_recordset($2) as a(id bigint, count bigint)

`
export const DELETE = `
  with del_nomenclature as (
    delete from request_content where request_id = $1
    returning $1 as id
  )
  delete from request where id=$1
  returning $1
`

export const LIST = `
  select a.id, a.date_create, a.division_id, d.name as division_name, a.user_id, e.name as user_name, a.is_accept, a.date_accept,
         case when count(b.nomenclature_id) <> 0
                then jsonb_agg(jsonb_build_object('id', b.nomenclature_id, 'name', c.name, 'unit', c.unit, 'count', b.count))
              else '[]'::jsonb
           end as nomenclature, sum(c.cost * b.count)::numeric(15,2) as total_sum
  from request a
         left join division d on a.division_id = d.id
         left join auth_users e on a.user_id = e.id
         left join request_content as b on a.id = b.request_id
         left join nomenclature as c on b.nomenclature_id = c.id
  group by (a.id, a.date_create, a.division_id, d.name, a.user_id, e.name, a.is_accept, a.date_create, a.date_accept)
  order by a.date_create, d.name;
`
