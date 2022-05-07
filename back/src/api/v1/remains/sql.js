// Сделана выборка текущих остатков с учётом заявки. Заявка учитывается только если она принята (приход) на следующий
// день после инвентаризации, т.к. инвентаризация всегда происходит в конце дня. Либо если не было ещё инвентаризации
// на складе отображаются остатки последней исполненной заявки.
export const LIST = `
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
         where a.is_accept and a.date_accept <= current_date
           and (b.date is null or a.date_accept > b.date)
         group by a.division_id, c.nomenclature_id
       )
  select a.id as division_id, a.name as division_name, bc.id as nomenclature_id, bc.name as nomenclature_name,
         coalesce(f.last_date, d.date) as date, bc.cost, bc.unit,
         coalesce(coalesce(e.count, 0) + coalesce(f.count, 0), 0)::numeric(15,2) as count,
         (coalesce(coalesce(e.count, 0) + coalesce(f.count, 0), 0) * bc.cost)::numeric(15,2)  as sum
  from division a
         left join division_nomenclature b on a.id = b.division_id
         left join nomenclature bc on b.nomenclature_id = bc.id
         left join last_dates_inventory c on a.id = c.division_id
         left join inventory d on c.date = d.date and d.division_id = a.id
         left join inventory_content e on d.id = e.inventory_id and b.nomenclature_id = e.nomenclature_id
         left join accept_requests_remains f on a.id = f.division_id and b.nomenclature_id = f.nomenclature_id
  where $1 = '' or a.name~*$1
  order by coalesce(f.last_date, d.date) desc, a.name, bc.name
`
