export const ADD = `
  insert into nomenclature(name, unit, lot_value, min_count, max_count, cost, is_perishable)
  values($1, $2, $3, $4, $5, $6, $7)
  returning *
`
export const EDIT = `
  update nomenclature
  set name=$2, unit=$3, lot_value=$4, min_count=$5, max_count=$6, cost=$7, is_perishable=$8
  where id=$1
  returning *
`
export const DELETE = `
  delete from nomenclature where id=$1
  returning $1
`

export const LIST = `
  select id, name, unit, lot_value, min_count, max_count, cost, is_perishable from nomenclature
  where $1 = '' or name~*$1
  order by name
`
