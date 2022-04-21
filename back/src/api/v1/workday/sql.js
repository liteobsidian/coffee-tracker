export const ADD = `
  insert into workday(
                       date, auth_user_id, division_id, uncash_sum, cash_sum,
                       date_open, date_close
                       )
  values($1, $2, $3, $4, $5, $6, $7)
  returning *
`
export const EDIT = `
  update workday set date=$2, auth_user_id=$3, division_id=$4, uncash_sum=$5,
  cash_sum=$6, date_open=$7, date_close=$8
  where id=$1
  returning *
`
export const DELETE = `
  delete from division where id=$1
  returning $1
`

export const LIST = `
  select to_char(a.date, 'DD.MM.YYYY') as date, a.auth_user_id as user_id,
         b.name as user_name, c.name as division_name, a.division_id, a.uncash_sum,
         a.cash_sum, a.date_open, a.date_close
  from workday a
  left join auth_users b on a.auth_user_id = b.id
  left join division c on a.division_id = c.id
  where $1 = '' or b.name~*$1 or c.name~*$1
  order by a.date desc
`
