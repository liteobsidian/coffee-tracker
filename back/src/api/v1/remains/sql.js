export const LIST = `
  with last_dates as (
    select max(date) as date, division_id
    from inventory
    where date < current_date
    group by division_id
  ) select b.id, a.date, a.division_id, c.name as division_name, d.nomenclature_id,
    e.name as nomenclature_name, d.count, e.cost, e.unit, (e.cost * d.count)::numeric(15,2) as sum
  from last_dates a
    left join inventory b on a.date = b.date and a.division_id = b.division_id
    left join division c on b.division_id = c.id
    left join inventory_content d on b.id = d.inventory_id
    left join nomenclature e on d.nomenclature_id = e.id
  where $1 = '' or c.name~*$1
  order by date desc, division_name, nomenclature_name
`
