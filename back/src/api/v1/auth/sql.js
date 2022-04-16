export const GET = `
    SELECT a.id, a.name, a.login, a.is_admin, a.password
    FROM auth_users AS a
    WHERE a.login=$1
    `
export const ADD = `
    insert into auth_users(name, login, password, is_admin) values($1, $2, $3, $4)
    returning *
    `
export const EDIT = `
    update auth_users set name=$2, login=$3, password=$4, is_admin=$5 where id=$1
    returning *
    `
export const DELETE = `
    delete from auth_users where id=$1
    returning $1
    `

export const LIST = `
    select id, name, login, is_admin from auth_users
    where $1 = '' or name~*$1
    order by name
    `
