export const GET_STYLE = `
SHOW datestyle
`
export const SET_STYLE = `
SET datestyle = 'DMY'
`
export const ADD = `
  insert into workday(
    date, auth_user_id, division_id, uncash_sum, cash_sum,
    date_open, date_close
    )
  values ($1::date, $2, $3, $4, $5, $6, $7)
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
  select a.id, to_char(a.date, 'DD.MM.YYYY') as date, a.auth_user_id as user_id,
         b.name as user_name, c.name as division_name, a.division_id, a.uncash_sum,
         a.cash_sum, a.date_open, a.date_close
  from workday a
  left join auth_users b on a.auth_user_id = b.id
  left join division c on a.division_id = c.id
  where $1 = '' or b.name~*$1 or c.name~*$1
  order by a.date desc
`

export const GET = `
  select a.id, to_char(a.date, 'DD.MM.YYYY') as date, a.auth_user_id as user_id,
         b.name as user_name, c.name as division_name, a.division_id, a.uncash_sum,
         a.cash_sum, to_char(a.date_open, 'DD.MM.YYYY HH:mm') as date_open,
         to_char(a.date_close, 'DD.MM.YYYY HH:mm') as date_close
  from workday a
  left join auth_users b on a.auth_user_id = b.id
  left join division c on a.division_id = c.id
  where a.auth_user_id = $1 and a.date::date=current_date::date
`

export const START = `
  update workday set date_open = current_timestamp
    where date::date = current_date::date and auth_user_id = $1
    returning id
`

export const END = `
  update workday set date_close = current_timestamp, uncash_sum = $2, cash_sum = $3
    where date::date = current_date::date and auth_user_id = $1
    returning id
`

export const NEXT = `
  select b.name, to_char(a.date, 'DD.MM.YYYY') as date
  from workday a
    left join division b on a.division_id = b.id
    where a.auth_user_id = $1 and a.date::date > current_date
    order by a.date limit 1
`
