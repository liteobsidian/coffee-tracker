'use strict'
export const LIST = `
SELECT a.id,a.name, a.oid
FROM stat.organization a
WHERE NOT a.deleted 
AND a.inn is not null
`
export const GET = `
SELECT a.id,a.name,a.oid
FROM stat.organization a
WHERE NOT a.deleted 
AND a.id = $1
`
export const GET_BY_WORD = `
SELECT a.id,a.name,a.oid
FROM stat.organization a
WHERE NOT a.deleted 
AND a.inn is not null 
AND LOWER(a.name) LIKE ('%'||$1||'%')
`
export const LIST_NAME = `
SELECT a.name FROM stat.organization a
WHERE NOT a.deleted 
AND a.inn is not null
`

export const LIST_OID = `
SELECT a.oid FROM stat.organization a
WHERE NOT a.deleted 
AND a.inn is not null
`
export const LIST_OID_LIST = `
select a.list_oid as oid FROM stat.organization a 
WHERE NOT a.deleted 
AND a.inn is not null 
AND a.list_oid is not null
`
export const LIST_ORG = `
select a.inn,a.kpp,a.name,a.list_oid as oid, a.id FROM stat.organization a 
WHERE NOT a.deleted 
AND a.inn is not null 
AND a.list_oid is not null
`
export const LIST_ORG_PERIOD = `
select o.inn,o.kpp,i.org->>'name' as name,o.list_oid as oid, o.id
from stat.organization o
cross join jsonb_array_elements(o.list_name) as i(org)
where i.org->>'period'=$1 
AND NOT o.deleted 
AND o.inn is not null 
AND o.list_oid is not null
`
export const LIST_NAME_PERIOD = `
SELECT i.org->>'name' as name FROM stat.organization a
cross join jsonb_array_elements(a.list_name) as i(org)
where i.org->>'period'=$1 
AND NOT a.deleted 
AND a.inn is not null
`
export const FIND_BY_OID = `
SELECT id,oid,inn,name,name_subject_mo,federal_subject_id,list_oid,list_name FROM stat.organization WHERE oid = $1
`
export const UPDATE_NAME_BY_OID = `
UPDATE stat.organization 
SET name=$2,
full_name=$2,
list_name = $3
WHERE oid = $1 RETURNING id
`
