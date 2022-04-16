'use strict'
export const LIST_BY_PERIOD_devel = `
SELECT '' as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_users b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND a.organization_id = $1 and a.template_id = $2
 AND a.period >= $3
 AND a.period <= $4
 LIMIT 200
`
export const LIST_BY_PERIOD = `
SELECT t.name as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.template as t ON a.template_id = t.id
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND a.organization_id = $1 and t.id = $2
 AND a.period >= $3
 AND a.period <= $4
 LIMIT 200
`

export const LIST_BY_PERIOD_ALL_ORG_devel = `
SELECT '' as shablon,o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND a.template_id = $1
 AND a.period >= $2
 AND a.period <= $3
 LIMIT 200
`

export const LIST_BY_PERIOD_ALL_ORG = `
SELECT t.name as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.template as t ON a.template_id = t.id
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND t.id = $1
 AND a.period >= $2
 AND a.period <= $3
 LIMIT 200
`

export const LIST_BY_TYPE_devel = `
SELECT  '' as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND a.organization_id = $1 and a.template_id = $2
 LIMIT 200
 `
export const LIST_BY_TYPE = `
SELECT t.name as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.template as t ON a.template_id = t.id
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND a.organization_id = $1 and t.id = $2
 LIMIT 200
`
export const LIST_BY_TYPE_ALL_devel = `
SELECT '' as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
  LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND a.template_id = $1
 LIMIT 200
`

export const LIST_BY_TYPE_ALL = `
SELECT t.name as shablon, o.name as organization, o.short_name as org_short_name, a.created_at,a.uuid, a.name as file_name, a.path as path_in_system, a.period, a.status, a.auth_user_id as user,
  (SELECT get_shortname(b.full_name,1) AS shortname
   FROM stat.auth_user b  where b.id = a.auth_user_id)
 FROM stat.input_file a
 LEFT JOIN stat.template as t ON a.template_id = t.id
 LEFT JOIN stat.organization as o ON a.organization_id = o.id
 WHERE NOT a.deleted AND t.id = $1
 LIMIT 200
`

export const ADD = `INSERT INTO stat.input_file(
template_id, organization_id, division_id, uuid, name, path, period, auth_user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`

export const ADDROW = `INSERT INTO stat.input_row(
input_file_id, data)
VALUES ($1, $2) RETURNING id`

export const DELETE = 'DELETE FROM stat.input_file WHERE uuid=$1'

export const ADD_DATA = `
UPDATE stat.input_file
SET data=$2, protocol_errors=$3, status=jsonb_set(status,'{validation}', $4) WHERE id =$1 RETURNING id
`
export const PROTOCOL_ERRORS = `
SELECT o.short_name as organization, a.protocol_errors, a.created_at
FROM stat.input_file a
LEFT JOIN stat.organization as o ON a.organization_id = o.id
WHERE NOT a.deleted AND a.uuid = $1
`
export const SET_HANDLED = `
UPDATE stat.input_file
SET status =  CASE
WHEN status->'handled' = 'false' THEN jsonb_set(status,'{handled}','true')
ELSE jsonb_set(status,'{handled}','false')
END
WHERE uuid=$1 RETURNING id;
`
export const LIST_FOR_REPORT = `
SELECT a.id, a.uuid, o.idx_in_report ,a.data
FROM stat.input_file as a
LEFT JOIN stat.template as t ON a.template_id = t.id
LEFT JOIN stat.organization as o ON a.organization_id = o.id
WHERE NOT a.deleted AND t.id = $1 AND (status->'handled' = 'true' or status->'validation' = 'true')
AND a.data is NOT NULL
AND  a.period = $2
order by idx_in_report
`
export const FIND_BY_UUID = `
SELECT a.path,a.name,a.created_at
FROM stat.input_file as a
WHERE uuid = $1
`
export const FIND_BY_UUID_AND_SHEMA = `
SELECT a.id,a.path,a.name,a.period,t.type_report_id,a.organization_id,a.auth_user_id,t.template_file,t.schema_validation,a.created_at
FROM stat.input_file as a
LEFT JOIN stat.template as t ON a.template_id = t.id
WHERE uuid = $1
`
