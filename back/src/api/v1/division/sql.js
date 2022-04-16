export const ADD = `
  insert into division(name, address, city, factor) values($1, $2, $3, $4)
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
