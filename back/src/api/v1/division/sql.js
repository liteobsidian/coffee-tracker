export const ADD = `
  with add_division as (
    insert into division(name, address, city, factor) values($1, $2, $3, $4)
    returning *
  ),
  add_nomenclature as (
    SELECT id as nomenclature_id, (select id from add_division) as division_id
    FROM jsonb_to_recordset($5) AS a(id bigint)
  ) insert into division_nomenclature (division_id, nomenclature_id)
  values (select division_id,nomenclature_id from add_nomenclature;)
  returning *
`
export const EDIT = `
  update division set name=$2, address=$3, city=$4, factor=$5 where id=$1
  returning *
`
export const DELETE = `
  delete from division where id=$1
  returning $1
`

export const LIST = `
  select id, name, address, city, factor from division
  where $1 = '' or name~*$1
  order by name
`
