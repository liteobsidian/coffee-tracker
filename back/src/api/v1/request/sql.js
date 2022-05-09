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

export const NEED_COUNT_NOMENCLATURE = `
with last_dates_inventory as (
    select max(date) as date, division_id
    from inventory
    where date < current_date
    group by division_id
),
accept_requests_remains as (
    select a.division_id, c.nomenclature_id, sum(c.count) count, max(a.date_accept) as last_date
    from request a
             left join last_dates_inventory b on a.division_id = b.division_id
             left join request_content c on a.id = c.request_id
    where a.is_accept
      and a.date_accept <= current_date
      and (b.date is null or a.date_accept > b.date)
    group by a.division_id, c.nomenclature_id
),
calculate_remains as (
    select a.id                                                                               as division_id,
           bc.id                                                                              as nomenclature_id,
           coalesce(coalesce(e.count, 0) + coalesce(f.count, 0), 0)::numeric(15, 2)           as count,
           bc.min_count,
           ceil(bc.max_count * a.factor)                                                      as max_count,
           bc.lot_value,
           (coalesce(coalesce(e.count, 0) + coalesce(f.count, 0), 0) <= bc.min_count)::boolean as need_request,
           bc.name, bc.unit
    from division a
             left join division_nomenclature b on a.id = b.division_id
             left join nomenclature bc on b.nomenclature_id = bc.id
             left join last_dates_inventory c on a.id = c.division_id
             left join inventory d on c.date = d.date and d.division_id = a.id
             left join inventory_content e on d.id = e.inventory_id and b.nomenclature_id = e.nomenclature_id
             left join accept_requests_remains f on a.id = f.division_id and b.nomenclature_id = f.nomenclature_id
    order by coalesce(f.last_date, d.date) desc, a.name, bc.name
) select a.division_id, jsonb_agg(jsonb_build_object('id', a.nomenclature_id, 'count',
    (case when a.need_request then ceil((a.max_count - a.count) / a.lot_value) * a.lot_value else 0 end)::numeric(15,2),
    'name', a.name, 'unit', a.unit))
    as nomenclature
from calculate_remains a
group by a.division_id
`
